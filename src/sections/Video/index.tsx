import { useAdminContent } from "@/admin";

export function Video() {
  const { content } = useAdminContent();

  return (
    <section id="video" className="relative bg-magenta py-20 sm:py-28">
      <div className="absolute inset-0 grain" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-poster text-xs uppercase tracking-[0.3em] text-(--cream)/80">{content.video.kicker}</p>
            <h2 className="mt-2 font-display text-5xl leading-[0.9] text-cream sm:text-7xl">{content.video.title}</h2>
            <p className="mt-3 max-w-xl text-(--cream)/90">
              {content.video.description}
            </p>
          </div>
        </div>

        <div className="relative mt-10">
          <span className="tape -top-3 left-6 h-6 w-28" />
          <span className="tape -top-3 right-10 h-6 w-28 rotate-3!" />
          <div
            className="relative aspect-video w-full overflow-hidden rounded-3xl border-2 border-ink bg-ink"
            style={{ boxShadow: "10px 10px 0 var(--ink)" }}
          >
            <img
              src={content.video.coverImage}
              alt="Mayami official video cover"
              width={1024}
              height={1024}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[oklch(0.15_0.08_280/0.45)] text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream text-3xl text-ink shadow-[6px_6px_0_var(--magenta)]">▶</span>
              <p className="font-display text-4xl text-cream sm:text-6xl">{content.video.statusText}</p>
              <a href={content.links.youtubeVideo} target="_blank" rel="noreferrer" className="btn-pop btn-aqua">{content.video.watchButtonLabel}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
