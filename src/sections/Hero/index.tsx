import artistImg from "@/assets/mayami-artist.jpg";
import { MayamiLogo } from "@/components/MayamiLogo";
import { TIKTOK_LINK } from "@/config/links";

export function Hero() {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-background">
      <div className="absolute inset-0 grain" />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 pt-5 sm:px-8">
        <span className="font-poster text-sm uppercase tracking-[0.2em] text-ink">
          Ellene Leya Masri 
        </span>
        <a
          href="#stream"
          className="rounded-full border-2 border-ink bg-cream px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-ink shadow-[3px_3px_0_var(--ink)] transition hover:-translate-y-0.5"
        >
          Out tomorrow
        </a>
      </header>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-24 pt-10 sm:px-8 sm:pt-14 md:grid-cols-[1.15fr_1fr] md:gap-14 md:pb-32 md:pt-16">
        {/* Hero copy */}
        <div className="order-2 md:order-1">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-magenta px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-cream shadow-[3px_3px_0_var(--ink)] wiggle">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
            New Single · Out Tomorrow
          </div>

          <p className="font-poster text-xs uppercase tracking-[0.35em] text-ink">
            Mayami, My Miami
          </p>

          <div className="mt-4">
            <MayamiLogo className="max-w-120 drop-shadow-[6px_6px_0_var(--ink)] sm:max-w-140" />
            <h1 className="sr-only">Mayami, My Miami</h1>
          </div>

          <p className="mt-6 max-w-xl text-base font-semibold text-ink sm:text-lg">
            A sunset-soaked love letter to the city. Stream it, watch it, share it —
            and follow the journey from the painted walls of Miami.
          </p>

          <div className="mt-7 flex items-center gap-3">
            <a href="https://ffm.to/mayami" target="_blank" rel="noreferrer" className="btn-pop btn-magenta">▶ Pre-Save / Stream</a>
            <a href="#video" className="btn-pop btn-aqua">◉ Watch the Video</a>
          </div>
        </div>

        {/* Artist portrait card */}
        <div className="order-1 md:order-2">
          <div className="relative mx-auto w-full max-w-md">
            <span className="tape -top-4 left-10 h-6 w-24" />
            <span className="tape -top-4 right-10 h-6 w-24 rotate-3!" />
            <div
              className="relative overflow-hidden rounded-3xl border-2 border-ink bg-ink"
              style={{ boxShadow: "12px 12px 0 var(--ink)" }}
            >
              <img
                src={artistImg}
                alt="Ellene Leya Masri — Mayami"
                width={1320}
                height={1920}
                className="block aspect-3/4 w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 border-t-2 border-ink bg-cream px-4 py-3 sm:pl-20">
                <span className="whitespace-nowrap font-poster text-[10px] uppercase tracking-[0.25em] text-ink">Single · 2026</span>
                <MayamiLogo className="w-auto! max-h-7" />
              </div>
            </div>
            <span className="absolute -bottom-5 -left-5 hidden h-16 w-16 rotate-12 items-center justify-center rounded-full border-2 border-ink bg-aqua font-poster text-[10px] uppercase text-ink shadow-[4px_4px_0_var(--ink)] sm:flex">
              New<br />Drop
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}

export function HeroMarquee() {
  const marqueeLinks = [
    { label: "Mayami, My Miami", href: "#hero", external: false },
    { label: "Out Tomorrow", href: "#stream", external: false },
    { label: "Ellene Leya Masri", href: TIKTOK_LINK, external: true },
    { label: "Stream · Watch · Share", href: "#video", external: false },
  ] as const;

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
