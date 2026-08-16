import Image from "next/image";
import Link from "next/link";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Mempool Ingestion", href: "/#modules" },
      { label: "Contract Events", href: "/#modules" },
      { label: "Exploit Sandbox", href: "/#modules" },
      { label: "Launch App", href: "/toolkit" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Network Pulse", href: "/#pulse" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-emerald/10 px-6 py-14 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-mono text-sm font-semibold uppercase tracking-[0.2em] text-fg"
          >
            <Image
              src="/brand/phosphor-mark.png"
              alt="phosphor"
              width={286}
              height={256}
              className="h-6 w-auto"
            />
            phosphor
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-fg-dim">
            On-chain cyber forensics for Monad threat researchers. Testnet
            tooling — not audited, not for production incident response.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-fg-dim transition-colors hover:text-emerald"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-fg-dim/10 pt-6 text-xs text-fg-dim sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} phosphor. Monad testnet demo interface.</span>
        <span className="font-mono uppercase tracking-[0.14em]">All systems nominal</span>
      </div>
    </footer>
  );
}
