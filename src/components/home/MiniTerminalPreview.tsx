"use client";

import { useEffect, useState } from "react";
import { generateLogLine, type LogLine } from "@/components/hero/terminal-data";

const SEVERITY_COLOR: Record<LogLine["severity"], string> = {
  critical: "text-danger",
  warn: "text-amber",
  notice: "text-cyan",
  info: "text-emerald",
};

export function MiniTerminalPreview({ lines = 4 }: { lines?: number }) {
  // Starts empty (not random-seeded) so server and client hydration markup
  // match exactly; the real feed is populated client-side only, after mount.
  const [feed, setFeed] = useState<LogLine[]>([]);

  useEffect(() => {
    queueMicrotask(() => setFeed(Array.from({ length: lines }, () => generateLogLine())));
    const id = setInterval(() => {
      setFeed((prev) => [...prev.slice(1), generateLogLine()]);
    }, 1600);
    return () => clearInterval(id);
  }, [lines]);

  return (
    <div className="hud-panel rounded-md px-3.5 py-3">
      <div className="flex min-h-[76px] flex-col gap-1.5 font-mono text-[10.5px] leading-relaxed">
        {feed.map((line) => (
          <p key={line.id} className={`truncate ${SEVERITY_COLOR[line.severity]}`}>
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}
