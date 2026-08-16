const STEPS = [
  {
    n: "01",
    title: "Connect",
    body: "Link your wallet and point phosphor at Monad testnet. No account, no signup — just a chain connection.",
  },
  {
    n: "02",
    title: "Ingest",
    body: "Mempool transactions and contract events stream in continuously, before they're ever confirmed.",
  },
  {
    n: "03",
    title: "Detect",
    body: "Heuristics flag anomalous contracts and suspicious call patterns as they surface, not after the fact.",
  },
  {
    n: "04",
    title: "Simulate",
    body: "Fork chain state locally and run an exploit path against it before it happens for real.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-emerald/10 px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">How It Works</p>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          From raw mempool noise to a reproducible incident timeline
        </h2>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {STEPS.map((step) => (
            <div key={step.n} className="flex gap-4">
              <span className="font-mono text-2xl font-semibold text-emerald-dim">{step.n}</span>
              <div>
                <h3 className="text-base font-semibold text-fg">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-dim">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
