import textureImg from "@/assets/mayami-texture.jpg";
import { TIKTOK_LINK, INSTAGRAM_LINK, YOUTUBE_VIDEO_LINK } from "@/config/links";

export function Social() {
  return (
    <section id="social" className="relative overflow-hidden bg-ink py-20 text-cream sm:py-28">
      <img
        src={textureImg}
        alt=""
        width={1920}
        height={1280}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen"
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <p className="font-poster text-xs uppercase tracking-[0.3em] text-aqua">02 / Follow</p>
        <h2 className="mt-2 font-display text-5xl leading-[0.9] sm:text-7xl">
          <span className="text-stack-magenta">Join the </span>
          <span className="text-stack-blue">journey</span>
        </h2>
        <p className="mt-4 max-w-xl text-lg text-(--cream)/80">
          Snippets, behind-the-scenes, dance challenges — drop into the daily Miami diary.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <a href={TIKTOK_LINK} className="group relative overflow-hidden rounded-3xl border-2 border-cream bg-linear-to-br from-magenta to-electric p-7 transition hover:-translate-y-1" style={{ boxShadow: "8px 8px 0 var(--magenta)" }}>
            <p className="font-poster text-[11px] uppercase tracking-[0.3em] opacity-80">Primary</p>
            <p className="font-display text-5xl">TikTok</p>
            <p className="mt-3 text-sm opacity-90">Catch the snippet trending right now.</p>
            <span className="mt-5 inline-flex items-center gap-2 font-poster uppercase tracking-wider">
              Follow @ellene <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </a>
          <a href={INSTAGRAM_LINK} className="group relative overflow-hidden rounded-3xl border-2 border-cream bg-linear-to-br from-aqua to-electric p-7 text-ink transition hover:-translate-y-1" style={{ boxShadow: "8px 8px 0 var(--aqua)" }}>
            <p className="font-poster text-[11px] uppercase tracking-[0.3em] opacity-70">Primary</p>
            <p className="font-display text-5xl">Instagram</p>
            <p className="mt-3 text-sm opacity-80">Daily Miami diary, drops & exclusives.</p>
            <span className="mt-5 inline-flex items-center gap-2 font-poster uppercase tracking-wider">
              Follow @ellene <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </a>
          <a href={YOUTUBE_VIDEO_LINK} className="group relative overflow-hidden rounded-3xl border-2 border-cream bg-background p-7 text-ink transition hover:-translate-y-1" style={{ boxShadow: "8px 8px 0 var(--cream)" }}>
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
