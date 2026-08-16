"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { formatUnits } from "viem";
import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { truncateAddress } from "@/lib/monad";

const BASE_BUTTON =
  "rounded-sm border px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-all disabled:cursor-not-allowed disabled:opacity-60";

const NO_PROVIDER_PATTERN = /not found|not detected|no provider|no injected/i;

const noopSubscribe = () => () => {};

/**
 * Wallet detection happens in the browser, so the connector list can differ
 * between server and client render. Gate on mount to keep React quiet —
 * SSR-safe via useSyncExternalStore rather than a setState-in-effect, which
 * avoids the extra render pass while keeping the exact same protection.
 */
function useHasMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function ConnectWalletButton({ className = "" }: { className?: string }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const mounted = useHasMounted();

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={`${BASE_BUTTON} border-fg-dim/30 text-fg-dim ${className}`}
      >
        Connect Wallet
      </button>
    );
  }

  if (!isConnected) {
    // lib/wagmi.ts lists injected() first — that connector represents
    // whichever EIP-6963 wallet is installed (MetaMask, if present).
    const [metaMask, ...otherConnectors] = connectors;
    const noProvider = error ? NO_PROVIDER_PATTERN.test(error.message) : false;

    return (
      <div className="flex flex-col items-end gap-1.5">
        <button
          type="button"
          onClick={() => metaMask && connect({ connector: metaMask })}
          disabled={isPending || !metaMask}
          className={`${BASE_BUTTON} border-fg-dim/30 text-fg-dim hover:border-fg-dim/60 hover:text-fg ${className}`}
        >
          {isPending ? "Connecting…" : "Connect MetaMask"}
        </button>

        {otherConnectors.length > 0 && (
          <div className="flex gap-3">
            {otherConnectors.map((c) => (
              <button
                key={c.uid}
                type="button"
                onClick={() => connect({ connector: c })}
                disabled={isPending}
                className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-dim/70 underline decoration-dotted underline-offset-2 hover:text-fg-dim"
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {error && (
          <span className="max-w-[240px] text-right font-mono text-[10px] text-danger">
            {noProvider ? (
              <>
                No wallet detected —{" "}
                <a
                  href="https://metamask.io/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  install MetaMask
                </a>
              </>
            ) : (
              "Connection failed — try again"
            )}
          </span>
        )}
      </div>
    );
  }

  const onMonad = chainId === monadTestnet.id;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className={`${BASE_BUTTON} flex items-center gap-2 border-emerald/60 bg-emerald/10 text-emerald hover:bg-emerald/20 ${className}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${onMonad ? "bg-emerald animate-pulse-dot" : "bg-amber"}`}
        />
        {address && truncateAddress(address)}
      </button>

      {menuOpen && (
        <div className="hud-panel animate-hud-in absolute right-0 top-[calc(100%+8px)] z-50 w-60 rounded-md p-2 font-mono text-xs">
          <div className="flex flex-col gap-1.5 border-b border-fg-dim/10 px-2.5 pb-2.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-fg-dim">Network</span>
              <span className={onMonad ? "text-emerald" : "text-amber"}>
                {onMonad ? monadTestnet.name : `Chain ${chainId}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fg-dim">Balance</span>
              <span className="text-fg tabular-nums">
                {/* wagmi v3 returns a raw bigint here — no `.formatted` field */}
                {balance
                  ? `${Number(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}`
                  : "—"}
              </span>
            </div>
          </div>

          {!onMonad && (
            <button
              type="button"
              onClick={() => {
                switchChain({ chainId: monadTestnet.id });
                setMenuOpen(false);
              }}
              disabled={isSwitching}
              className="w-full rounded px-2.5 py-2 text-left text-amber hover:bg-amber/10"
            >
              {isSwitching ? "Switching…" : `Switch to ${monadTestnet.name}`}
            </button>
          )}
          <button
            type="button"
            onClick={async () => {
              if (!address) return;
              await navigator.clipboard.writeText(address);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="w-full rounded px-2.5 py-2 text-left text-fg-dim hover:bg-fg-dim/10 hover:text-fg"
          >
            {copied ? "Copied" : "Copy Address"}
          </button>
          <button
            type="button"
            onClick={() => {
              disconnect();
              setMenuOpen(false);
            }}
            className="w-full rounded px-2.5 py-2 text-left text-fg-dim hover:bg-danger/10 hover:text-danger"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
