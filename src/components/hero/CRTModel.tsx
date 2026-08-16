"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { ScreenSurface } from "./ScreenSurface";

const MODEL_URL = "/models/crt-monitor.glb";

export function CRTModel({
  startedAtRef,
  reducedMotion,
}: {
  startedAtRef: React.RefObject<number>;
  reducedMotion: React.RefObject<boolean>;
}) {
  const { scene } = useGLTF(MODEL_URL);

  const chassis = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        const material = child.material as THREE.MeshStandardMaterial;
        if (material?.color) {
          material.color = material.color.clone().multiplyScalar(0.72);
          material.roughness = Math.min(1, (material.roughness ?? 0.6) + 0.08);
          material.envMapIntensity = 0.6;
        }
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    return () => {
      chassis.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
        }
      });
    };
  }, [chassis]);

  return (
    <group>
      <primitive object={chassis} />
      <ScreenSurface startedAtRef={startedAtRef} reducedMotion={reducedMotion} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
