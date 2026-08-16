"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { BOOT_TIMELINE, getBootElapsed } from "./useBootSequence";
import { SCREEN_LOCAL_POSITION } from "./ScreenSurface";

const TIGHT_POS = new THREE.Vector3(0.02, 0.1, 0.72);
const TIGHT_FOV = 20;
const TIGHT_LOOKAT = new THREE.Vector3(...SCREEN_LOCAL_POSITION);

const WIDE_POS = new THREE.Vector3(0, 0.03, 1.55);
const WIDE_FOV = 32;
const WIDE_LOOKAT = new THREE.Vector3(0, -0.02, 0);

const SCROLL_POS_DELTA = new THREE.Vector3(0.24, 0.12, 0.6);
const SCROLL_FOV_DELTA = 6;

function easeOutCubic(t: number): number {
  const c = Math.min(Math.max(t, 0), 1);
  return 1 - Math.pow(1 - c, 3);
}

export function CameraRig({
  startedAtRef,
  reducedMotion,
  scrollProgressRef,
  pointerRef,
}: {
  startedAtRef: React.RefObject<number>;
  reducedMotion: React.RefObject<boolean>;
  scrollProgressRef: React.RefObject<number>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const dampedPointer = useRef({ x: 0, y: 0 });
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useFrame((_state, dt) => {
    const camera = cameraRef.current;
    if (!camera) return;

    const elapsed = getBootElapsed(startedAtRef.current);
    const bootStart = reducedMotion.current ? 0 : BOOT_TIMELINE.flickerEnd;
    const bootEnd = reducedMotion.current ? 0 : BOOT_TIMELINE.revealEnd;
    const bootT = easeOutCubic(
      bootEnd > bootStart ? (elapsed - bootStart) / (bootEnd - bootStart) : 1,
    );

    const scroll = scrollProgressRef.current ?? 0;

    targetPos.current.lerpVectors(TIGHT_POS, WIDE_POS, bootT);
    targetPos.current.addScaledVector(SCROLL_POS_DELTA, scroll);

    targetLookAt.current.lerpVectors(TIGHT_LOOKAT, WIDE_LOOKAT, bootT);

    const fov = THREE.MathUtils.lerp(TIGHT_FOV, WIDE_FOV, bootT) + SCROLL_FOV_DELTA * scroll;

    const pointer = pointerRef.current ?? { x: 0, y: 0 };
    const dampFactor = 1 - Math.pow(0.001, dt);
    dampedPointer.current.x += (pointer.x - dampedPointer.current.x) * dampFactor;
    dampedPointer.current.y += (pointer.y - dampedPointer.current.y) * dampFactor;

    const parallaxStrength = 0.05 * (1 - scroll * 0.6);
    const px = dampedPointer.current.x * parallaxStrength;
    const py = -dampedPointer.current.y * parallaxStrength * 0.6;

    camera.position.lerpVectors(camera.position, targetPos.current, 1 - Math.pow(0.0001, dt));
    camera.position.x += px * dt * 6;
    camera.position.y += py * dt * 6;
    camera.fov += (fov - camera.fov) * (1 - Math.pow(0.0005, dt));
    camera.updateProjectionMatrix();

    camera.lookAt(targetLookAt.current);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={TIGHT_POS}
      fov={TIGHT_FOV}
      near={0.05}
      far={20}
    />
  );
}
