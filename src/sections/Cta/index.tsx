import textureImg from "@/assets/mayami-texture.jpg";
import { SPOTIFY_LINK, YOUTUBE_VIDEO_LINK, TIKTOK_LINK, INSTAGRAM_LINK } from "@/config/links";

export function Cta() {
  return (
    <section className="relative overflow-hidden bg-electric py-24 text-cream sm:py-32">
      <img
        src={textureImg}
        alt=""
        width={1920}
        height={1280}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen"
      />
      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <p className="font-poster text-xs uppercase tracking-[0.3em] text-aqua">05 / Don't sleep on it</p>
        <h2 className="mt-3 font-display text-6xl leading-[0.85] sm:text-[140px]">
          <span className="text-stack-magenta">Press </span>
          <span className="text-stack-blue">play.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-(--cream)/85">
          Stream the single. Watch the video. Tag <span className="font-bold text-aqua">#MayamiMyMiami</span> and ride the wave.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={SPOTIFY_LINK} target="_blank" rel="noreferrer" className="btn-pop btn-magenta">Stream the Single</a>
          <a href={YOUTUBE_VIDEO_LINK} target="_blank" rel="noreferrer" className="btn-pop btn-aqua">Watch the Video</a>
          <a href={TIKTOK_LINK} target="_blank" rel="noreferrer" className="btn-pop btn-cream">TikTok</a>
          <a href={INSTAGRAM_LINK} target="_blank" rel="noreferrer" className="btn-pop btn-ink">Instagram</a>
        </div>
      </div>
    </section>
  );
}
