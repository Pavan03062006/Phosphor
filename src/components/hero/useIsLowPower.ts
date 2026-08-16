"use client";

import { useSyncExternalStore } from "react";

function getSnapshot(): boolean {
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  return narrow || (coarsePointer && fewCores);
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  const widthQuery = window.matchMedia("(max-width: 767px)");
  const pointerQuery = window.matchMedia("(pointer: coarse)");
  widthQuery.addEventListener("change", callback);
  pointerQuery.addEventListener("change", callback);
  return () => {
    widthQuery.removeEventListener("change", callback);
    pointerQuery.removeEventListener("change", callback);
  };
}

/** Heuristic gate for reducing WebGL/postprocessing cost on weaker devices. */
export function useIsLowPower(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
