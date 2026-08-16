"use client";

import { useEffect, useState } from "react";

export interface MonadStats {
  blockHeight: number;
  tps: number;
  gasPriceGwei: number;
  gasLimitPct: number;
  confirmations: number;
  mempoolQueue: number;
  flaggedContracts: number;
}

const INITIAL_STATS: MonadStats = {
  blockHeight: 4_812_006,
  tps: 8_420,
  gasPriceGwei: 11.2,
  gasLimitPct: 64,
  confirmations: 1,
  mempoolQueue: 612,
  flaggedContracts: 3,
};

function walk(value: number, magnitude: number, min: number, max: number): number {
  const next = value + (Math.random() - 0.48) * magnitude;
  return Math.min(Math.max(next, min), max);
}

/**
 * Mock, client-only Monad network telemetry. No live data source exists in
 * this project yet — swap this hook's interval for a real subscription
 * (mempool websocket / RPC poll) when one is wired up.
 */
export function useMonadStats(): MonadStats {
  const [stats, setStats] = useState<MonadStats>(INITIAL_STATS);

  useEffect(() => {
    const id = setInterval(() => {
      setStats((prev) => ({
        blockHeight: prev.blockHeight + (Math.random() < 0.6 ? 1 : 0),
        tps: Math.round(walk(prev.tps, 900, 3200, 12800)),
        gasPriceGwei: Number(walk(prev.gasPriceGwei, 2.4, 4, 38).toFixed(1)),
        gasLimitPct: Math.round(walk(prev.gasLimitPct, 6, 38, 92)),
        confirmations: prev.confirmations >= 6 ? 1 : prev.confirmations + 1,
        mempoolQueue: Math.round(walk(prev.mempoolQueue, 140, 80, 2400)),
        flaggedContracts:
          Math.random() < 0.08
            ? Math.max(0, prev.flaggedContracts + (Math.random() < 0.5 ? 1 : -1))
            : prev.flaggedContracts,
      }));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return stats;
}
