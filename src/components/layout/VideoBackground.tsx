"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed, full-viewport looping video used as an ambient page backdrop —
 * not a video player. No controls, no interaction, purely decorative
 * (aria-hidden). Paused for prefers-reduced-motion users.
 */
export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
    }
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-void-deep" aria-hidden="true">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className="h-full w-full object-cover"
        style={{
          opacity: 0.4,
          filter: "brightness(0.75) contrast(1.15) saturate(1.2)",
        }}
      >
        <source src="/video/phosphor-bg.mp4" type="video/mp4" />
      </video>

      {/* Brand-tinted readability scrim, consistent regardless of the frame playing beneath it */}
      <div className="absolute inset-0 bg-gradient-to-b from-void-deep/80 via-void-deep/70 to-void-deep/90" />
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{ background: "radial-gradient(ellipse at center, rgba(52,255,160,0.08), transparent 70%)" }}
      />
      <div className="vignette-overlay" />
    </div>
  );
}
