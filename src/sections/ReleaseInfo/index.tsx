import coverImg from "@/assets/mayami-cover.jpg";
import { MayamiLogo } from "@/components/MayamiLogo";
import { RELEASE_DATE, GENRE_OR_MOOD } from "@/config/links";

export function ReleaseInfo() {
  return (
    <section className="relative bg-cream py-20 text-ink sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 md:grid-cols-[1fr_1.3fr] md:items-center">
        <div className="relative">
          <span className="tape -top-4 left-8 h-6 w-24" />
          <img
            src={coverImg}
            alt="Single cover"
            width={1024}
            height={1024}
            loading="lazy"
            className="aspect-square w-full rounded-2xl border-2 border-ink object-cover"
            style={{ boxShadow: "10px 10px 0 var(--magenta)" }}
          />
        </div>
        <div>
          <p className="font-poster text-xs uppercase tracking-[0.3em] text-(--ink)/60">04 / Release Info</p>
          <h2 className="mt-2 font-display text-5xl leading-[0.9] sm:text-6xl">
            The <span className="text-magenta">credits</span>
          </h2>
          <dl className="mt-8 divide-y divide-(--ink)/15 border-y-2 border-ink">
            {([
              ["Artist", "Ellene Leya Masri"],
              ["Title", <span className="flex items-center justify-end gap-2"><MayamiLogo className="w-auto! max-h-8" /><span>, My Miami</span></span>],
              ["Release date", RELEASE_DATE],
              ["Location", "Miami, USA"],
              ["Video", "Coming soon"],
              ["Genre / Mood", GENRE_OR_MOOD],
            ] as const).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 py-3.5">
                <dt className="font-poster text-xs uppercase tracking-[0.25em] text-(--ink)/60">{k}</dt>
                <dd className="font-display text-lg sm:text-xl">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
