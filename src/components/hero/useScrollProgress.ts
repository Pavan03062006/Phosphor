"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Tracks scroll progress (0 at top of `sectionRef`, 1 after one viewport
 * height of scroll) into a ref for three.js consumers, and mirrors it onto
 * a CSS custom property (`--scroll-progress`) on the same element so CSS
 * transitions can react without any React re-render in the hot path.
 */
export function useScrollProgress(sectionRef: RefObject<HTMLElement | null>) {
  const progressRef = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const span = Math.max(window.innerHeight, 1);
      const p = Math.min(Math.max(-rect.top / span, 0), 1);
      progressRef.current = p;
      el.style.setProperty("--scroll-progress", p.toFixed(4));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sectionRef]);

  return progressRef;
}
