"use client";

import { useEffect, useState } from "react";
import { generateLogLine, type LogLine } from "@/components/hero/terminal-data";
import { useMonadStats } from "@/components/hero/useMonadStats";
import { formatNumber } from "@/lib/format";
import { useTxVolumeSeries } from "./useTxVolumeSeries";

function useFlaggedTicker(max = 6): LogLine[] {
  const [alerts, setAlerts] = useState<LogLine[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      const candidate = generateLogLine();
      if (candidate.severity !== "warn" && candidate.severity !== "critical") return;
      setAlerts((prev) => [candidate, ...prev].slice(0, max));
    }, 900);
    return () => clearInterval(id);
  }, [max]);

  return alerts;
}

function VolumeChart() {
  const series = useTxVolumeSeries();
  return (
    <div className="hud-panel flex h-40 items-end gap-[3px] rounded-md p-4 sm:h-48">
      {series.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-dim to-emerald transition-[height] duration-500 ease-out"
          style={{ height: `${value}%`, opacity: 0.35 + (value / 100) * 0.65 }}
        />
      ))}
    </div>
  );
}

function AlertTicker() {
  const alerts = useFlaggedTicker();
  return (
    <div className="hud-panel flex h-40 flex-col gap-2 overflow-hidden rounded-md p-4 sm:h-48">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim">
        Flagged Activity
      </p>
      {alerts.length === 0 && (
        <p className="font-mono text-xs text-fg-dim/60">Listening…</p>
      )}
      {alerts.map((alert) => (
        <p
          key={alert.id}
          className={`animate-hud-in truncate font-mono text-[11px] ${
            alert.severity === "critical" ? "text-danger" : "text-amber"
          }`}
        >
          {alert.text}
        </p>
      ))}
    </div>
  );
}

export function LiveNetworkPulse() {
  const stats = useMonadStats();

  return (
    <section id="pulse" className="border-t border-emerald/10 px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">Network Pulse</p>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Monad testnet, watched continuously
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Block Height", value: `#${formatNumber(stats.blockHeight)}` },
            { label: "TPS", value: formatNumber(stats.tps) },
            { label: "Gas Price", value: `${stats.gasPriceGwei.toFixed(1)} gwei` },
            { label: "Flagged", value: String(stats.flaggedContracts).padStart(2, "0") },
          ].map((stat) => (
            <div key={stat.label} className="hud-panel rounded-md px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-fg-dim">{stat.label}</p>
              <p className="mt-1 font-mono text-lg text-emerald text-glow-emerald tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <VolumeChart />
          <AlertTicker />
        </div>
      </div>
    </section>
  );
}
