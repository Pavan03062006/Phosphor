"use client";

import { useEffect, useState } from "react";

export function useLiveRows<T>(
  generator: () => T,
  intervalMs: number,
  max: number,
  paused = false,
): T[] {
  // Starts empty (not random-seeded) so server and client hydration markup
  // match; the initial batch is generated client-side only, after mount.
  const [rows, setRows] = useState<T[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setRows((prev) => (prev.length > 0 ? prev : Array.from({ length: Math.min(max, 6) }, generator)));
    });
  }, [generator, max]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setRows((prev) => [generator(), ...prev].slice(0, max));
    }, intervalMs);
    return () => clearInterval(id);
  }, [generator, intervalMs, max, paused]);

  return rows;
}
