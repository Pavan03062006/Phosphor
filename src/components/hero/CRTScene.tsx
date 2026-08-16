"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense } from "react";
import * as THREE from "three";
import { CameraRig } from "./CameraRig";
import { CRTModel } from "./CRTModel";

export function CRTScene({
  startedAtRef,
  reducedMotion,
  scrollProgressRef,
  pointerRef,
  isLowPower,
}: {
  startedAtRef: React.RefObject<number>;
  reducedMotion: React.RefObject<boolean>;
  scrollProgressRef: React.RefObject<number>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
  isLowPower: boolean;
}) {
  return (
    <Canvas
      dpr={isLowPower ? 1 : [1, 1.75]}
      gl={{
        antialias: !isLowPower,
        powerPreference: "high-performance",
        toneMapping: THREE.NoToneMapping,
      }}
      style={{ background: "transparent" }}
    >
      <CameraRig
        startedAtRef={startedAtRef}
        reducedMotion={reducedMotion}
        scrollProgressRef={scrollProgressRef}
        pointerRef={pointerRef}
      />

      <ambientLight intensity={0.12} />
      <directionalLight position={[0.6, 1.2, 1.4]} intensity={0.55} color="#eaf6ff" />
      <directionalLight position={[-1.2, 0.2, -0.6]} intensity={0.22} color="#34ffa0" />

      <Suspense fallback={null}>
        <CRTModel startedAtRef={startedAtRef} reducedMotion={reducedMotion} />
      </Suspense>

      {!isLowPower && (
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.32}
            luminanceSmoothing={0.25}
            mipmapBlur
            intensity={0.75}
            radius={0.6}
          />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
