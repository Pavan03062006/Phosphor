"use client";

import Link from "next/link";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";

export function HeroCopy({ boot }: { boot: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-5 pb-9 sm:justify-start sm:px-10 sm:pb-14"
      style={{
        opacity: boot ? "calc(0.9 + var(--scroll-progress, 0) * 0.1)" : 0,
        transform: boot
          ? "translateY(calc(6px - var(--scroll-progress, 0) * 6px)) scale(calc(1 + var(--scroll-progress, 0) * 0.02))"
          : "translateY(14px)",
        transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="pointer-events-auto max-w-xl text-center sm:text-left">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan text-glow-emerald">
          Phosphor // Monad Testnet — Operator Console
        </p>
        <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-fg sm:text-[2.75rem]">
          On-Chain Incident Response,
          <br />
          Reconstructed in Real Time
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-fg-dim sm:text-base">
          phosphor ingests mempool activity, tracks contract events, and
          simulates exploit paths for Monad threat researchers.
        </p>
        <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Link
            href="/toolkit"
            className="group relative overflow-hidden rounded-sm border border-emerald/60 bg-emerald/10 px-6 py-3 text-center font-mono text-sm font-semibold uppercase tracking-[0.12em] text-emerald transition-all hover:bg-emerald/20"
            style={{ boxShadow: "0 0 24px -6px rgba(52,255,160,0.55)" }}
          >
            Initialize Toolkit
          </Link>
          <ConnectWalletButton className="!px-6 !py-3 !text-sm" />
        </div>
      </div>
    </div>
  );
}
