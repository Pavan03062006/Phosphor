"use client";

import { useState } from "react";
import { truncateMiddle } from "@/components/hero/terminal-data";
import { generateMempoolRow, type MempoolTxRow } from "./mock-data";
import { useLiveRows } from "./useLiveRows";

export function MempoolTable({
  onSelectRow,
}: {
  onSelectRow?: (row: MempoolTxRow) => void;
}) {
  const [paused, setPaused] = useState(false);
  const rows = useLiveRows(generateMempoolRow, 1100, 40, paused);

  return (
    <div className="hud-panel overflow-hidden rounded-md">
      <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto_auto] items-center gap-3 border-b border-emerald/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-dim">
        <span>Hash</span>
        <span>From</span>
        <span>To</span>
        <span className="text-right">Value</span>
        <span className="text-right">Gas</span>
        <span className="text-right">
          {paused ? <span className="text-amber">Paused</span> : "Live"}
        </span>
      </div>
      <div
        className="max-h-[420px] overflow-y-auto"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {rows.map((row) => (
          <div
            key={row.id}
            className="animate-hud-in grid grid-cols-[1fr_1fr_1fr_auto_auto_auto] items-center gap-3 border-b border-fg-dim/5 px-4 py-2 font-mono text-xs"
          >
            <span className="truncate text-cyan">{truncateMiddle(row.hash, 8, 6)}</span>
            <span className="truncate text-fg-dim">{truncateMiddle(row.from, 6, 4)}</span>
            <span className="truncate text-fg-dim">{truncateMiddle(row.to, 6, 4)}</span>
            <span className="text-right text-emerald tabular-nums">{row.valueEth} MON</span>
            <span className="text-right text-fg-dim tabular-nums">{row.gasGwei}g</span>
            <button
              type="button"
              onClick={() => onSelectRow?.(row)}
              className="justify-self-end rounded-sm border border-emerald/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald transition-colors hover:bg-emerald/10"
            >
              Analyze
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
