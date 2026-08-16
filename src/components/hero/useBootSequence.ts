"use client";

import { useEffect, useRef, useState } from "react";

export const BOOT_TIMELINE = {
  darkEnd: 450,
  flickerEnd: 1350,
  revealEnd: 3200,
} as const;

export type BootPhase = "dark" | "flicker" | "reveal" | "idle";

function phaseAt(elapsed: number): BootPhase {
  if (elapsed < BOOT_TIMELINE.darkEnd) return "dark";
  if (elapsed < BOOT_TIMELINE.flickerEnd) return "flicker";
  if (elapsed < BOOT_TIMELINE.revealEnd) return "reveal";
  return "idle";
}

/**
 * Drives the boot choreography off a single mount timestamp. Continuous
 * per-frame consumers (camera rig, screen shader) should read `startedAtRef`
 * directly inside useFrame rather than subscribing to React state, so the
 * 60fps animation never triggers a re-render.
 */
export function useBootSequence() {
  const startedAtRef = useRef<number>(0);
  const [phase, setPhase] = useState<BootPhase>("dark");
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    startedAtRef.current = performance.now();

    if (reducedMotionRef.current) {
      setPhase("idle");
      return;
    }

    const timers = [
      setTimeout(() => setPhase("flicker"), BOOT_TIMELINE.darkEnd),
      setTimeout(() => setPhase("reveal"), BOOT_TIMELINE.flickerEnd),
      setTimeout(() => setPhase("idle"), BOOT_TIMELINE.revealEnd),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return { phase, startedAtRef, reducedMotion: reducedMotionRef } as const;
}

export function getBootElapsed(startedAt: number): number {
  if (!startedAt) return 0;
  return performance.now() - startedAt;
}

export { phaseAt };
