import { useAdminContent } from "@/admin";
import { MayamiLogo } from "@/components/MayamiLogo";
import { HeroSlider } from "./Slider/index";

export function Hero() {
  const { content } = useAdminContent();

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-background">
      <div className="absolute inset-0 grain" />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 pt-5 sm:px-8">
        <span className="font-poster text-sm uppercase tracking-[0.2em] text-ink">
          {content.hero.topArtist}
        </span>
        <a
          href="#stream"
          className="rounded-full border-2 border-ink bg-cream px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-ink shadow-[3px_3px_0_var(--ink)] transition hover:-translate-y-0.5"
        >
          {content.hero.topCtaLabel}
        </a>
      </header>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-10 pt-10 sm:px-8 sm:pb-16 sm:pt-14 md:grid-cols-[1.15fr_1fr] md:gap-14 md:pb-32 md:pt-16">
        {/* Hero copy */}
        <div>
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-[oklch(0.88_0.19_95)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink shadow-[3px_3px_0_var(--ink)] wiggle">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
            {content.hero.badgeText}
          </div>

          <p className="font-poster text-xs uppercase tracking-[0.35em] text-ink">
            {content.hero.subtitle}
          </p>

          <div className="mt-4">
            <MayamiLogo className="max-w-120 sm:max-w-140" />
            <h1 className="sr-only">Mayami, My Miami</h1>
          </div>

          <p className="mt-6 max-w-xl text-base font-semibold text-ink sm:text-lg">
            {content.hero.description}
          </p>

          <div className="mt-7 flex items-center gap-3">
            <a href={content.hero.streamHref} target="_blank" rel="noreferrer" className="btn-pop btn-magenta">{content.hero.streamLabel}</a>
            <a href={content.hero.watchHref} className="btn-pop btn-aqua">{content.hero.watchLabel}</a>
          </div>
        </div>

        {/* Artist portrait card */}
        <HeroSlider />
      </div>

    </section>
  );
}

export function HeroMarquee() {
  const { content } = useAdminContent();
  const marqueeLinks = content.marquee.items;

  return (
    <div className="relative z-20 overflow-hidden border-y-2 border-ink bg-ink py-3">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-10 px-5 font-poster text-lg uppercase tracking-widest text-cream">
            {marqueeLinks.map((item, index) => (
              <div key={`${item.label}-${index}`} className="contents">
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className="transition hover:text-aqua focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua"
                >
                  {item.label}
                </a>
                <span className={index % 2 === 0 ? "text-magenta" : "text-aqua"}>✦</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
