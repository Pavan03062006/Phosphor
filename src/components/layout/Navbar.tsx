"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";

const NAV_LINKS = [
  { href: "/#modules", label: "Product" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#pulse", label: "Network Pulse" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-emerald/10 bg-gradient-to-b from-black/70 via-black/40 to-transparent backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-mono text-sm font-semibold uppercase tracking-[0.2em] text-fg"
          >
            <Image
              src="/brand/phosphor-mark.png"
              alt="phosphor"
              width={286}
              height={256}
              priority
              className="h-7 w-auto"
              style={{ filter: "drop-shadow(0 0 6px rgba(52,255,160,0.5))" }}
            />
            phosphor
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.14em] text-fg-dim transition-colors hover:text-emerald"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/toolkit"
              className="rounded-sm border border-fg-dim/30 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-fg-dim transition-all hover:border-fg-dim/60 hover:text-fg"
            >
              Launch App
            </Link>
            <ConnectWalletButton />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-fg-dim/30 text-fg md:hidden"
          >
            <span className="font-mono text-sm">{mobileOpen ? "×" : "≡"}</span>
          </button>
        </nav>
      </div>

      {mobileOpen && (
        <div className="border-b border-emerald/10 bg-void-deep/98 px-5 py-6 backdrop-blur-sm md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-sm uppercase tracking-[0.14em] text-fg-dim hover:text-emerald"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/toolkit"
              onClick={() => setMobileOpen(false)}
              className="rounded-sm border border-fg-dim/30 px-4 py-2.5 text-center font-mono text-xs font-semibold uppercase tracking-[0.12em] text-fg-dim"
            >
              Launch App
            </Link>
            <ConnectWalletButton className="w-full justify-center" />
          </div>
        </div>
      )}
    </header>
  );
}
