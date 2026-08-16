import * as THREE from "three";
import { generateBootLines, generateLogLine, type LogLine } from "./terminal-data";

const FONT = "600 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const ROW_HEIGHT = 15;

function colorFor(severity: LogLine["severity"]): string {
  switch (severity) {
    case "critical":
      return "#ff7a8f";
    case "warn":
      return "#ffcf6b";
    case "notice":
      return "#7fe4ff";
    default:
      return "#5dffb0";
  }
}

/**
 * Owns an offscreen canvas + THREE.CanvasTexture and renders a procedural
 * operator-console feed into it: a one-shot boot sequence followed by a
 * continuously scrolling stream of mempool/contract/exploit-sim log lines.
 * All CRT visual treatment (glow, scanlines, curvature) lives in the
 * screen's shader, not here — this class only produces plain text content.
 */
export class TerminalRenderer {
  readonly texture: THREE.CanvasTexture;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly width: number;
  private readonly height: number;
  private readonly maxLines: number;

  private lines: LogLine[] = [];
  private idCounter = 0;

  private booted = false;
  private bootQueue: string[] = generateBootLines();
  private bootLineIndex = 0;
  private nextBootLineAt = 0;
  private nextFeedLineAt = 0;

  constructor(width = 640, height = 396) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.maxLines = Math.floor(height / ROW_HEIGHT) - 1;

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    this.paint();
  }

  /**
   * Call once per frame with an ever-increasing millisecond clock. Loops
   * internally (capped) so a throttled/backgrounded tab that only gets a
   * render tick every few seconds still catches up through the queued
   * boot/feed lines instead of appearing frozen on the first line.
   */
  update(nowMs: number): void {
    let dirty = false;
    for (let i = 0; i < 32; i++) {
      const advanced = this.booted ? this.tickFeed(nowMs) : this.tickBoot(nowMs);
      if (!advanced) break;
      dirty = true;
    }
    if (dirty) {
      this.paint();
      this.texture.needsUpdate = true;
    }
  }

  dispose(): void {
    this.texture.dispose();
  }

  private nextId(): number {
    this.idCounter += 1;
    return this.idCounter;
  }

  private tickBoot(nowMs: number): boolean {
    if (this.bootLineIndex >= this.bootQueue.length) {
      this.booted = true;
      this.lines = [];
      this.nextFeedLineAt = nowMs + 260;
      return true;
    }
    if (nowMs < this.nextBootLineAt) return false;

    this.nextBootLineAt = nowMs + 150 + Math.random() * 110;
    this.lines.push({
      id: this.nextId(),
      severity: "info",
      text: this.bootQueue[this.bootLineIndex],
    });
    this.bootLineIndex += 1;
    if (this.lines.length > this.maxLines) this.lines.shift();
    return true;
  }

  private tickFeed(nowMs: number): boolean {
    if (nowMs < this.nextFeedLineAt) return false;
    this.nextFeedLineAt = nowMs + 210 + Math.random() * 260;
    this.lines.push(generateLogLine());
    if (this.lines.length > this.maxLines) this.lines.shift();
    return true;
  }

  private paint(): void {
    const { ctx, width, height } = this;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    ctx.font = FONT;
    ctx.textBaseline = "top";

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const y = 8 + i * ROW_HEIGHT;
      ctx.fillStyle = colorFor(line.severity);
      ctx.globalAlpha = i > this.lines.length - 4 ? 1 : 0.82;
      ctx.fillText(line.text, 10, y, width - 20);
    }
    ctx.globalAlpha = 1;

    if (this.booted && Math.floor(performance.now() / 500) % 2 === 0) {
      const y = 8 + this.lines.length * ROW_HEIGHT;
      ctx.fillStyle = "#5dffb0";
      ctx.fillText("_", 10, y);
    }
  }
}
