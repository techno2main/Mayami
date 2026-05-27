import { useAdminContent } from "@/admin";

export function ReleaseInfo() {
  const { content } = useAdminContent();

  return (
    <section className="relative bg-cream py-20 text-ink sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 md:grid-cols-[1fr_1.3fr] md:items-center">
        <div className="relative">
          <span className="tape -top-4 left-8 h-6 w-24" />
          <img
            src={content.releaseInfo.coverImage}
            alt="Single cover"
            width={1024}
            height={1024}
            loading="lazy"
            className="aspect-square w-full rounded-2xl border-2 border-ink object-cover"
            style={{ boxShadow: "10px 10px 0 var(--magenta)" }}
          />
        </div>
        <div>
          <p className="font-poster text-xs uppercase tracking-[0.3em] text-ink/60">{content.releaseInfo.kicker}</p>
          <h2 className="mt-2 font-display text-5xl leading-[0.9] sm:text-6xl">
            {content.releaseInfo.titleLeft} <span className="text-magenta">{content.releaseInfo.titleHighlight}</span>
          </h2>
          <dl className="mt-8 divide-y divide-(--ink)/15 border-y-2 border-ink">
            {content.releaseInfo.rows.map(({ key: k, value: v }) => (
              <div key={k} className="flex items-center justify-between gap-4 py-3.5">
                <dt className="font-poster text-xs uppercase tracking-[0.25em] text-ink/60">{k}</dt>
                <dd className="font-display text-lg sm:text-xl">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
