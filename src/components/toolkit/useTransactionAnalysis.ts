"use client";

import { useCallback, useState } from "react";
import type { MempoolTxRow } from "./mock-data";
import type { TransactionAnalysis } from "./analysis-types";

type Status = "idle" | "loading" | "done" | "error";

export function useTransactionAnalysis() {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<TransactionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (tx: MempoolTxRow) => {
    setStatus("loading");
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/analyze-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          valueEth: tx.valueEth,
          gasGwei: tx.gasGwei,
        }),
      });
      const json: unknown = await res.json();
      if (!res.ok) {
        const message =
          json && typeof json === "object" && "error" in json
            ? String((json as { error: unknown }).error)
            : "Analysis failed.";
        throw new Error(message);
      }
      setData(json as TransactionAnalysis);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, analyze, reset };
}
