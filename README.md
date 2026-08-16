# phosphor

An on-chain cyber forensics toolkit for Monad testnet threat researchers. Real-time mempool ingestion, contract event tracking, and local exploit-sandbox simulation, wrapped in an operator-console UI with an AI-assisted transaction analysis panel.

This is a testnet demo interface — not audited, not for production incident response.

## Features

- **Cinematic 3D hero** — a vintage CRT monitor (`react-three-fiber` + custom shader) boots from darkness into a live procedural terminal feed, with scroll/pointer-driven camera parallax.
- **Wallet connect** — MetaMask-first via `wagmi` + `viem`, with Coinbase Wallet and optional WalletConnect. Prompts to switch networks if the wallet isn't on Monad Testnet.
- **Operator toolkit** (`/toolkit`, wallet-gated):
  - **Mempool Stream** — live-updating table of pending transactions.
  - **Contract Events** — live-updating table of contract events, flagged entries highlighted.
  - **Exploit Sandbox** — pick a target contract and an exploit pattern, run a simulated attack, get a step-by-step log and verdict.
- **AI transaction analysis** — click **Analyze** on any mempool row to get an AI-generated summary, risk score, a sender → contract → receiver flow map, and scored risk factors (via OpenRouter).

All on-chain data (transactions, contract events, network stats) is procedurally generated for demo purposes — there's no live Monad indexer wired up yet. Wallet connection and chain switching are real.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [`@react-three/fiber`](https://docs.pmnd.rs/react-three-fiber) / `drei` / `postprocessing` for the 3D hero
- [`wagmi`](https://wagmi.sh) v3 + [`viem`](https://viem.sh) + TanStack Query for wallet connection
- [OpenRouter](https://openrouter.ai) for AI transaction analysis

## Getting started

```bash
pnpm install
cp .env.local.example .env.local   # then fill in OPENROUTER_API_KEY
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Connect a wallet and go to `/toolkit` to try the dashboard.

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Required | Purpose |
|---|---|---|
| `OPENROUTER_API_KEY` | Yes, for AI analysis | Server-only key for the `/api/analyze-transaction` route. Get one at [openrouter.ai/keys](https://openrouter.ai/keys). Without it, the toolkit works fine — the Analyze panel just shows an error. |
| `OPENROUTER_MODEL` | No | Overrides the model used for analysis. Defaults to `openai/gpt-4o-mini`. |
| `NEXT_PUBLIC_WC_PROJECT_ID` | No | Enables the WalletConnect connector (mobile wallets via QR). Free project ID at [dashboard.reown.com](https://dashboard.reown.com). Injected wallets and Coinbase Wallet work without it. |
| `NEXT_PUBLIC_MONAD_TESTNET_RPC` | No | Not wired up by default (public RPC is used). See the comment in `src/lib/wagmi.ts` for the one-line change to point at a dedicated RPC once you hit rate limits. |

`OPENROUTER_API_KEY` is read server-side only (`src/app/api/analyze-transaction/route.ts`) and never sent to the browser.

## Project structure

```
src/
  app/
    page.tsx              homepage (hero + product sections)
    toolkit/page.tsx       operator dashboard (wallet-gated)
    api/analyze-transaction/route.ts   OpenRouter call, server-only
    providers.tsx          WagmiProvider + QueryClientProvider
  components/
    hero/                  3D CRT hero, boot sequence, camera rig, terminal feed
    home/                  homepage sections below the hero
    layout/                Navbar, Footer, video background
    wallet/                Connect wallet button (wagmi-backed)
    toolkit/               Mempool/contract-event tables, exploit sandbox, AI analysis panel
  lib/
    wagmi.ts               chains, connectors, transports
    format.ts               locale-pinned number formatting (avoids SSR/client hydration mismatches)
    monad.ts                address truncation helper
```

## Scripts

```bash
pnpm dev      # start dev server
pnpm build    # production build
pnpm start    # run the production build
pnpm lint     # eslint
```
