import { useAdminContent } from "@/admin";

export function Cta() {
  const { content } = useAdminContent();

  return (
    <section className="relative overflow-hidden bg-[oklch(0.68_0.17_182)] py-24 text-ink sm:py-32">
      <img
        src={content.cta.textureImage}
        alt=""
        width={1920}
        height={1280}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen"
      />
      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <p className="font-poster text-xs uppercase tracking-[0.3em] text-ink/80">{content.cta.kicker}</p>
        <h2 className="mt-3 font-display text-6xl leading-[0.85] sm:text-[140px]">
          <span className="text-ink">{content.cta.titleLeft} </span>
          <span className="text-ink">{content.cta.titleRight}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink/85">
          {content.cta.description} <span className="font-bold text-ink">{content.cta.hashtag}</span>
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={content.links.spotify} target="_blank" rel="noreferrer" className="btn-pop btn-magenta">Stream the Single</a>
          <a href={content.links.youtubeVideo} target="_blank" rel="noreferrer" className="btn-pop btn-aqua">Watch the Video</a>
          <a href={content.links.tiktok} target="_blank" rel="noreferrer" className="btn-pop btn-cream">TikTok</a>
          <a href={content.links.instagram} target="_blank" rel="noreferrer" className="btn-pop btn-ink">Instagram</a>
        </div>
      </div>
    </section>
  );
}
