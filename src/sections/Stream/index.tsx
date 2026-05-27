import { platforms } from "@/config/links";

export function Stream() {
  return (
    <section id="stream" className="relative bg-background py-20 sm:py-28">
      <div className="absolute inset-0 grain" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-poster text-xs uppercase tracking-[0.3em] text-(--ink)/70">01 / Listen</p>
            <h2 className="mt-2 font-display text-5xl leading-[0.9] text-ink sm:text-7xl">
              Stream the <span style={{ WebkitTextStroke: "2px var(--ink)", color: "var(--magenta)" }}>single</span>
            </h2>
          </div>
          <span className="hidden font-poster text-sm uppercase tracking-[0.2em] text-(--ink)/70 sm:block">
            Available everywhere
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((p, i) => (
            <a
              key={p.name}
              href={p.href}
              className={`group relative flex items-center justify-between rounded-2xl border-2 border-ink px-6 py-5 transition hover:-translate-y-1 hover:-translate-x-0.5 ${p.cls}`}
              style={{ boxShadow: "6px 6px 0 var(--ink)" }}
            >
              <div>
                <p className="font-poster text-[10px] uppercase tracking-[0.25em] opacity-70">
                  {String(i + 1).padStart(2, "0")} · {p.tag}
                </p>
                <p className="font-display text-2xl leading-none">{p.name}</p>
              </div>
              <span className="font-poster text-2xl transition group-hover:translate-x-1">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
