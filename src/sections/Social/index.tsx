import { useAdminContent } from "@/admin";

export function Social() {
  const { content } = useAdminContent();

  return (
    <section id="social" className="relative overflow-hidden bg-ink py-20 text-cream sm:py-28">
      <img
        src={content.social.textureImage}
        alt=""
        width={1920}
        height={1280}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen"
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <p className="font-poster text-xs uppercase tracking-[0.3em] text-aqua">{content.social.kicker}</p>
        <h2 className="mt-2 font-display text-5xl leading-[0.9] sm:text-7xl">
          <span className="text-stack-magenta">{content.social.titleLeft} </span>
          <span className="text-stack-blue">{content.social.titleRight}</span>
        </h2>
        <p className="mt-4 max-w-xl text-lg text-(--cream)/80">
          {content.social.description}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <a href={content.links.tiktok} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-3xl border-2 border-cream bg-linear-to-br from-magenta to-electric p-7 transition hover:-translate-y-1" style={{ boxShadow: "8px 8px 0 var(--magenta)" }}>
            <p className="font-poster text-[11px] uppercase tracking-[0.3em] opacity-80">Primary</p>
            <p className="font-display text-5xl">TikTok</p>
            <p className="mt-3 text-sm opacity-90">Catch the snippet trending right now.</p>
            <span className="mt-5 inline-flex items-center gap-2 font-poster uppercase tracking-wider">
              Follow @ellene <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </a>
          <a href={content.links.instagram} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-3xl border-2 border-cream bg-linear-to-br from-aqua to-electric p-7 text-ink transition hover:-translate-y-1" style={{ boxShadow: "8px 8px 0 var(--aqua)" }}>
            <p className="font-poster text-[11px] uppercase tracking-[0.3em] opacity-70">Primary</p>
            <p className="font-display text-5xl">Instagram</p>
            <p className="mt-3 text-sm opacity-80">Daily Miami diary, drops & exclusives.</p>
            <span className="mt-5 inline-flex items-center gap-2 font-poster uppercase tracking-wider">
              Follow @ellene <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </a>
          <a href={content.links.youtubeVideo} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-3xl border-2 border-cream bg-background p-7 text-ink transition hover:-translate-y-1" style={{ boxShadow: "8px 8px 0 var(--cream)" }}>
            <p className="font-poster text-[11px] uppercase tracking-[0.3em] opacity-70">Watch</p>
            <p className="font-display text-5xl">YouTube</p>
            <p className="mt-3 text-sm opacity-80">Official video & visualizers.</p>
            <span className="mt-5 inline-flex items-center gap-2 font-poster uppercase tracking-wider">
              Subscribe <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
