"use client";

import { useState } from "react";
import { useAccount, useChainId, useDisconnect, useSwitchChain } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { useMonadStats } from "@/components/hero/useMonadStats";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { formatNumber } from "@/lib/format";
import { truncateAddress } from "@/lib/monad";
import { ContractEventsTable } from "./ContractEventsTable";
import { ExploitSandbox } from "./ExploitSandbox";
import type { MempoolTxRow } from "./mock-data";
import { MempoolTable } from "./MempoolTable";
import { TransactionAnalysisPanel } from "./TransactionAnalysisPanel";

const TABS = ["Mempool Stream", "Contract Events", "Exploit Sandbox"] as const;
type Tab = (typeof TABS)[number];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="hud-panel rounded-md px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-fg-dim">{label}</p>
      <p className="mt-1 font-mono text-lg text-emerald text-glow-emerald tabular-nums">{value}</p>
    </div>
  );
}

function ConnectPrompt() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">Operator Console</p>
      <h1 className="mt-3 max-w-md text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        Connect your wallet to initialize the toolkit
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-dim">
        phosphor reads your address to key your session locally. No
        transaction, no signature required to look around.
      </p>
      <div className="mt-7">
        <ConnectWalletButton className="!px-6 !py-3 !text-sm" />
      </div>
    </div>
  );
}

function NetworkWarning() {
  const { switchChain, isPending } = useSwitchChain();
  return (
    <div className="mb-6 flex flex-col items-start gap-2 rounded-md border border-amber/40 bg-amber/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-mono text-xs text-amber">
        Wrong network — phosphor expects Monad Testnet.
      </p>
      <button
        type="button"
        onClick={() => switchChain({ chainId: monadTestnet.id })}
        disabled={isPending}
        className="rounded-sm border border-amber/50 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-amber transition-colors hover:bg-amber/10"
      >
        {isPending ? "Switching…" : "Switch Network"}
      </button>
    </div>
  );
}

function Dashboard({ address }: { address: `0x${string}` }) {
  const [tab, setTab] = useState<Tab>("Mempool Stream");
  const [selectedTx, setSelectedTx] = useState<MempoolTxRow | null>(null);
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const stats = useMonadStats();
  const onMonad = chainId === monadTestnet.id;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">
            Operator Console
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            phosphor toolkit
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hud-panel rounded-md px-3 py-2 font-mono text-xs text-fg-dim">
            <span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${onMonad ? "bg-emerald" : "bg-amber"}`} />
            {truncateAddress(address)}
          </span>
          <button
            type="button"
            onClick={() => disconnect()}
            className="rounded-sm border border-fg-dim/30 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-dim transition-colors hover:border-fg-dim/60 hover:text-fg"
          >
            Disconnect
          </button>
        </div>
      </div>

      {!onMonad && <div className="mt-6"><NetworkWarning /></div>}

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <StatCard label="Block" value={`#${formatNumber(stats.blockHeight)}`} />
        <StatCard label="TPS" value={formatNumber(stats.tps)} />
        <StatCard label="Gas Price" value={`${stats.gasPriceGwei.toFixed(1)}g`} />
        <StatCard label="Gas Limit" value={`${stats.gasLimitPct}%`} />
        <StatCard label="Confirms" value={`${stats.confirmations}/6`} />
        <StatCard label="Mempool" value={formatNumber(stats.mempoolQueue)} />
        <StatCard label="Flagged" value={String(stats.flaggedContracts).padStart(2, "0")} />
      </div>

      <div className="mt-10 flex gap-1 border-b border-fg-dim/10">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
              tab === t
                ? "border-emerald text-emerald"
                : "border-transparent text-fg-dim hover:text-fg"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "Mempool Stream" && (
          <>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim">
              Select a transaction for AI analysis
            </p>
            <MempoolTable onSelectRow={setSelectedTx} />
          </>
        )}
        {tab === "Contract Events" && <ContractEventsTable />}
        {tab === "Exploit Sandbox" && <ExploitSandbox />}
      </div>

      {selectedTx && (
        <TransactionAnalysisPanel tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </div>
  );
}

export function ToolkitApp() {
  const { address } = useAccount();
  return address ? <Dashboard address={address} /> : <ConnectPrompt />;
}
