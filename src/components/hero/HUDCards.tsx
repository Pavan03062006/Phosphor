"use client";

import { formatNumber } from "@/lib/format";
import { useMonadStats } from "./useMonadStats";

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 sm:gap-4">
      <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.1em] text-fg-dim sm:text-[10px] sm:tracking-[0.14em]">
        {label}
      </span>
      <span className="whitespace-nowrap font-mono text-xs text-emerald text-glow-emerald tabular-nums sm:text-sm">
        {value}
      </span>
    </div>
  );
}

function HudCard({
  title,
  delay,
  className,
  children,
}: {
  title: string;
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`hud-panel animate-hud-in pointer-events-auto flex w-[136px] flex-col gap-1.5 rounded-md px-3 py-2.5 sm:w-[180px] sm:px-3.5 sm:py-3 md:w-[200px] ${className ?? ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-1 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-dim">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

export function HUDCards({ boot }: { boot: boolean }) {
  const stats = useMonadStats();
  if (!boot) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute left-3 top-20 flex flex-col gap-3 sm:left-8 sm:top-28">
        <HudCard title="Chain" delay={0}>
          <StatRow label="Block" value={`#${formatNumber(stats.blockHeight)}`} />
          <StatRow label="Confirms" value={`${stats.confirmations}/6`} />
        </HudCard>
      </div>

      <div className="absolute right-3 top-20 flex flex-col gap-3 sm:right-8 sm:top-28">
        <HudCard title="Network" delay={120}>
          <StatRow label="TPS" value={formatNumber(stats.tps)} />
          <StatRow label="Gas Price" value={`${stats.gasPriceGwei.toFixed(1)} gwei`} />
          <StatRow label="Gas Limit" value={`${stats.gasLimitPct}%`} />
        </HudCard>
      </div>

      <div className="absolute bottom-10 right-4 hidden flex-col gap-3 sm:right-8 md:flex">
        <HudCard title="Threat Surface" delay={240}>
          <StatRow label="Mempool Queue" value={formatNumber(stats.mempoolQueue)} />
          <StatRow
            label="Flagged"
            value={String(stats.flaggedContracts).padStart(2, "0")}
          />
        </HudCard>
      </div>
    </div>
  );
}
