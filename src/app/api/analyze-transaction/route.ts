import { NextResponse } from "next/server";

export const runtime = "nodejs";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

interface AnalyzeRequestBody {
  hash: string;
  from: string;
  to: string;
  valueEth: string;
  gasGwei: number;
}

const SYSTEM_PROMPT = `You are the analysis engine inside phosphor, an on-chain cyber forensics toolkit for Monad testnet threat researchers. You are given one pending mempool transaction from a SIMULATED demo feed (not real chain data) and must produce a plausible, well-reasoned security-style analysis as if it were real, for demonstration purposes. Write like a terse security operator, not a chatbot.

Respond with ONLY a single JSON object — no markdown fences, no commentary before or after — matching exactly this shape:
{
  "summary": string,        // 2-4 sentences, plain English, operator-console tone
  "riskScore": number,      // 0-100, integer
  "verdict": "benign" | "suspicious" | "high-risk",
  "factors": [
    { "label": string, "score": number, "note": string }
  ],                          // exactly 4 factors, score 0-100 integer, note under 12 words
  "flow": [
    { "id": string, "label": string, "role": "sender" | "contract" | "receiver", "risk": "low" | "medium" | "high" }
  ]                          // exactly 3 nodes, one each for "sender", "contract", "receiver" (id must equal role, each role appears exactly once). "label" must be a SHORT display string under 14 characters, e.g. a truncated address like "0x1234…abcd" — never a full 40-character address.
}`;

function buildUserPrompt(body: AnalyzeRequestBody): string {
  return `Transaction:
hash: ${body.hash}
from: ${body.from}
to: ${body.to}
value: ${body.valueEth} MON
gas: ${body.gasGwei} gwei
chain: Monad Testnet (simulated)`;
}

function extractJson(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model did not return valid JSON.");
    return JSON.parse(match[0]);
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let body: AnalyzeRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body?.hash || !body?.from || !body?.to) {
    return NextResponse.json({ error: "Missing transaction fields." }, { status: 400 });
  }

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://phosphor.local",
        "X-Title": "phosphor",
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        temperature: 0.4,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(body) },
        ],
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      return NextResponse.json(
        { error: `OpenRouter error (${upstream.status}): ${errText.slice(0, 300)}` },
        { status: 502 },
      );
    }

    const payload = await upstream.json();
    const content: string | undefined = payload?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Empty response from model." }, { status: 502 });
    }

    const parsed = extractJson(content);
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error contacting OpenRouter." },
      { status: 500 },
    );
  }
}
