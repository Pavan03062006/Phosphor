"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ScreenShaderMaterial } from "./ScreenMaterial";
import { TerminalRenderer } from "./TerminalRenderer";
import { BOOT_TIMELINE, getBootElapsed } from "./useBootSequence";

// Calibrated against the compressed CRT model: matches the physical glass
// bezel interior (see the front-on probe pass used to derive these values).
export const SCREEN_LOCAL_POSITION: [number, number, number] = [0.005, 0.092, 0.401];
export const SCREEN_LOCAL_SIZE: [number, number] = [0.322, 0.208];

function flickerAt(elapsed: number, reducedMotion: boolean): number {
  if (reducedMotion) return 1;
  if (elapsed < BOOT_TIMELINE.darkEnd) return 0;

  if (elapsed < BOOT_TIMELINE.flickerEnd) {
    const t = (elapsed - BOOT_TIMELINE.darkEnd) / (BOOT_TIMELINE.flickerEnd - BOOT_TIMELINE.darkEnd);
    const flicker = Math.random() < 0.18 ? Math.random() * 0.4 : 1;
    return Math.min(1, t * 1.6) * flicker;
  }

  if (elapsed < BOOT_TIMELINE.revealEnd) {
    const t = (elapsed - BOOT_TIMELINE.flickerEnd) / (BOOT_TIMELINE.revealEnd - BOOT_TIMELINE.flickerEnd);
    return 0.9 + 0.1 * t;
  }

  // Idle: a faint, slow phosphor breathing plus rare organic micro-flicker.
  const breathe = 0.985 + Math.sin(elapsed / 900) * 0.015;
  const microFlicker = Math.random() < 0.004 ? 0.85 : 1;
  return breathe * microFlicker;
}

export function ScreenSurface({
  startedAtRef,
  reducedMotion,
}: {
  startedAtRef: React.RefObject<number>;
  reducedMotion: React.RefObject<boolean>;
}) {
  const renderer = useMemo(() => new TerminalRenderer(), []);
  const material = useMemo(() => {
    const mat = new ScreenShaderMaterial();
    mat.uMap = renderer.texture;
    return mat;
  }, [renderer]);
  const lightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    return () => {
      material.dispose();
      renderer.dispose();
    };
  }, [material, renderer]);

  // Driven off performance.now() rather than R3F's internal clock: the
  // clock's delta is browser-clamped when the tab is backgrounded/throttled,
  // which would stall the boot typewriter and feed scroll. Wall-clock time
  // keeps content timing correct regardless of render-loop throttling.
  //
  // Imperative uniform/texture mutation on a three.js material every frame
  // is the standard R3F pattern; this object is driven by the render loop,
  // not React's render output, so it's intentionally exempt from the
  // compiler's immutability analysis.
  /* eslint-disable react-hooks/immutability */
  useFrame(() => {
    const now = performance.now();
    const elapsed = getBootElapsed(startedAtRef.current);
    renderer.update(now);

    const flicker = flickerAt(elapsed, reducedMotion.current);
    material.uFlicker = flicker;
    material.uTime = now / 1000;
    if (lightRef.current) {
      lightRef.current.intensity = flicker * 0.055;
    }
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <group position={SCREEN_LOCAL_POSITION}>
      <mesh>
        <planeGeometry args={SCREEN_LOCAL_SIZE} />
        <primitive object={material} attach="material" />
      </mesh>
      <pointLight
        ref={lightRef}
        color="#34ffa0"
        intensity={0}
        distance={0.6}
        position={[0, 0, 0.05]}
      />
    </group>
  );
}
