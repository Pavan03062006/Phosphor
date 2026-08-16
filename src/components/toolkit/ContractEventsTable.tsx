"use client";

import { truncateMiddle } from "@/components/hero/terminal-data";
import { formatNumber } from "@/lib/format";
import { generateContractEventRow } from "./mock-data";
import { useLiveRows } from "./useLiveRows";

export function ContractEventsTable() {
  const rows = useLiveRows(generateContractEventRow, 1400, 40);

  return (
    <div className="hud-panel overflow-hidden rounded-md">
      <div className="grid grid-cols-[1fr_auto_auto_1fr] gap-3 border-b border-emerald/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-dim">
        <span>Contract</span>
        <span>Event</span>
        <span>Block</span>
        <span>Tx Hash</span>
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {rows.map((row) => (
          <div
            key={row.id}
            className={`animate-hud-in grid grid-cols-[1fr_auto_auto_1fr] items-center gap-3 border-b border-fg-dim/5 px-4 py-2 font-mono text-xs ${
              row.flagged ? "bg-danger/5" : ""
            }`}
          >
            <span className="flex items-center gap-2 truncate text-fg">
              {row.flagged && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger" title="Flagged" />
              )}
              <span className="truncate">{row.contract}</span>
            </span>
            <span className="text-cyan">{row.event}</span>
            <span className="text-fg-dim tabular-nums">#{formatNumber(row.block)}</span>
            <span className="truncate text-fg-dim">{truncateMiddle(row.txHash, 8, 6)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
