import Link from "next/link";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";

export function AccessSection() {
  return (
    <section className="border-t border-emerald/10 px-6 py-20 sm:px-10 sm:py-28">
      <div
        className="hud-panel mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-lg px-8 py-14 text-center"
        style={{ boxShadow: "0 0 60px -20px rgba(52,255,160,0.25)" }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">Access</p>
        <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Ready to operate?
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-fg-dim sm:text-base">
          Connect a wallet and initialize the toolkit. Everything runs against
          Monad testnet — no mainnet risk, no signup.
        </p>
        <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row">
          <Link
            href="/toolkit"
            className="rounded-sm border border-emerald/60 bg-emerald/10 px-6 py-3 text-center font-mono text-sm font-semibold uppercase tracking-[0.12em] text-emerald transition-all hover:bg-emerald/20"
            style={{ boxShadow: "0 0 24px -6px rgba(52,255,160,0.55)" }}
          >
            Initialize Toolkit
          </Link>
          <ConnectWalletButton className="!px-6 !py-3 !text-sm" />
        </div>
      </div>
    </section>
  );
}
