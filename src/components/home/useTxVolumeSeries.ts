"use client";

import { useEffect, useState } from "react";

const BUCKETS = 28;

function seedSeries(): number[] {
  let v = 45;
  return Array.from({ length: BUCKETS }, () => {
    v = Math.min(96, Math.max(12, v + (Math.random() - 0.5) * 30));
    return Math.round(v);
  });
}

/** Mock rolling tx-volume series for the network pulse chart. */
export function useTxVolumeSeries(intervalMs = 850): number[] {
  // Starts flat (deterministic) so server and client hydration markup
  // match; the random series is seeded client-side only, after mount.
  const [series, setSeries] = useState<number[]>(() => Array(BUCKETS).fill(0));

  useEffect(() => {
    // Deferred to a microtask rather than called synchronously in the
    // effect body, per this codebase's set-state-in-effect convention.
    queueMicrotask(() => setSeries(seedSeries()));

    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1] ?? 50;
        const next = Math.min(98, Math.max(10, last + (Math.random() - 0.48) * 34));
        return [...prev.slice(1), Math.round(next)];
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return series;
}
