import { MiniTerminalPreview } from "./MiniTerminalPreview";

const MODULES = [
  {
    label: "01",
    title: "Mempool Ingestion",
    body: "Stream pending Monad transactions the instant they hit the network, before they're ever confirmed.",
  },
  {
    label: "02",
    title: "Contract Event Tracking",
    body: "Watch state diffs and emitted events across flagged contracts in real time, no polling delay.",
  },
  {
    label: "03",
    title: "Exploit Sandbox",
    body: "Fork chain state locally and simulate an attack path before it happens on mainnet.",
  },
];

export function ProductModules() {
  return (
    <section id="modules" className="relative border-t border-emerald/10 px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">Product</p>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Three modules, one operator console
        </h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {MODULES.map((mod) => (
            <div key={mod.label} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-emerald-dim">{mod.label}</span>
                <h3 className="text-lg font-semibold text-fg">{mod.title}</h3>
                <p className="text-sm leading-relaxed text-fg-dim">{mod.body}</p>
              </div>
              <MiniTerminalPreview />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
