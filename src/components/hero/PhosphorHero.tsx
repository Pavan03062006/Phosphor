"use client";

import { useRef } from "react";
import { CRTScene } from "./CRTScene";
import { HUDCards } from "./HUDCards";
import { HeroCopy } from "./HeroCopy";
import { useBootSequence } from "./useBootSequence";
import { useIsLowPower } from "./useIsLowPower";
import { usePointerParallax } from "./usePointerParallax";
import { useScrollProgress } from "./useScrollProgress";

export function PhosphorHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { phase, startedAtRef, reducedMotion } = useBootSequence();
  const scrollProgressRef = useScrollProgress(sectionRef);
  const pointerRef = usePointerParallax();
  const isLowPower = useIsLowPower();

  const contentVisible = phase === "reveal" || phase === "idle";
  const veilOpacity = phase === "dark" ? 1 : 0;

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-void-deep"
    >
      <div className="absolute inset-0 z-0">
        <CRTScene
          startedAtRef={startedAtRef}
          reducedMotion={reducedMotion}
          scrollProgressRef={scrollProgressRef}
          pointerRef={pointerRef}
          isLowPower={isLowPower}
        />
      </div>

      <div className="scanline-overlay z-10" />
      <div className="grain-overlay z-10" />
      <div className="vignette-overlay z-10" />

      <div
        className="pointer-events-none absolute inset-0 z-40 bg-void-deep"
        style={{
          opacity: veilOpacity,
          transition: "opacity 0.7s ease-out",
        }}
      />

      <HUDCards boot={contentVisible} />
      <HeroCopy boot={contentVisible} />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center"
        style={{
          opacity: contentVisible
            ? "calc(0.55 * (1 - var(--scroll-progress, 0) * 2.5))"
            : 0,
          transition: "opacity 0.9s ease-out",
        }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-dim">
          scroll to explore
        </span>
      </div>
    </section>
  );
}
