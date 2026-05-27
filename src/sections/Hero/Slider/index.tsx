import { useAdminContent } from "@/admin/AdminProvider";
import { MayamiLogo } from "@/components/MayamiLogo";
import { useMemo, useState } from "react";

type ResolvedSlide =
  | {
      type: "image";
      src: string;
      alt: string;
    }
  | {
      type: "video";
      alt: string;
      videoUrl: string;
      thumbnailSrc: string;
    };

export function HeroSlider() {
  const { content } = useAdminContent();
  const [activeSlide, setActiveSlide] = useState(0);
  const [playInlineVideo, setPlayInlineVideo] = useState(false);

  const slides = useMemo<ResolvedSlide[]>(
    () =>
      content.heroSlider.map((slide) => {
        if (slide.type === "image") {
          return slide;
        }

        return {
          ...slide,
          thumbnailSrc: slide.thumbnailSrc ?? toYoutubeThumbnailUrl(slide.videoUrl),
        };
      }),
    [content.heroSlider],
  );

  const safeSlides = slides.length > 0 ? slides : [{ type: "image", src: "", alt: "Empty slide" }];

  const goPrev = () => {
    setPlayInlineVideo(false);
    setActiveSlide((current) => (current === 0 ? safeSlides.length - 1 : current - 1));
  };

  const goNext = () => {
    setPlayInlineVideo(false);
    setActiveSlide((current) => (current + 1) % safeSlides.length);
  };

  const currentSlide = safeSlides[activeSlide] ?? safeSlides[0];

  return (
    <div>
      <div className="relative mx-auto w-full max-w-md">
        <span className="tape -top-4 left-10 h-6 w-24" />
        <span className="tape -top-4 right-10 h-6 w-24 rotate-3!" />
        <div
          className="relative overflow-hidden rounded-3xl border-2 border-ink bg-ink"
          style={{ boxShadow: "12px 12px 0 var(--ink)" }}
        >
          <div className="relative aspect-3/4 w-full">
            {currentSlide.type === "video" && playInlineVideo ? (
              <iframe
                title={currentSlide.alt}
                src={toYoutubeEmbedUrl(currentSlide.videoUrl)}
                width="100%"
                height="100%"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={currentSlide.type === "video" ? currentSlide.thumbnailSrc : currentSlide.src}
                  alt={currentSlide.alt}
                  width={1320}
                  height={1920}
                  className="block h-full w-full object-cover"
                />

                {currentSlide.type === "video" ? (
                  <button
                    type="button"
                    onClick={() => setPlayInlineVideo(true)}
                    className="absolute inset-0 flex items-center justify-center bg-[oklch(0.15_0.08_280/0.35)]"
                    aria-label="Lire la video dans le slider"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-2xl text-ink shadow-[4px_4px_0_var(--magenta)]">▶</span>
                  </button>
                ) : null}
              </>
            )}
          </div>

          <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Slide precedente"
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Slide suivante"
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink"
            >
              →
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 border-t-2 border-ink bg-cream px-4 py-3 sm:pl-20">
            <span className="whitespace-nowrap font-poster text-[10px] uppercase tracking-[0.25em] text-ink">Single · 2026</span>
            <MayamiLogo className="w-auto! max-h-7" />
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {safeSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setPlayInlineVideo(false);
                setActiveSlide(index);
              }}
              aria-label={`Aller au slide ${index + 1}`}
              className={`h-2.5 w-2.5 rounded-full border border-ink ${index === activeSlide ? "bg-ink" : "bg-cream"}`}
            />
          ))}
        </div>

        <span className="absolute -bottom-5 -left-5 hidden h-16 w-16 rotate-12 items-center justify-center rounded-full border-2 border-ink bg-aqua font-poster text-[10px] uppercase text-ink shadow-[4px_4px_0_var(--ink)] sm:flex">
          New<br />Drop
        </span>
      </div>
    </div>
  );
}

function toYoutubeEmbedUrl(url: string) {
  const videoId = extractYoutubeVideoId(url) ?? "WiB_UoexqVo";
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&playsinline=1`;
}

function toYoutubeThumbnailUrl(url: string) {
  const videoId = extractYoutubeVideoId(url) ?? "WiB_UoexqVo";
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
}

function extractYoutubeVideoId(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const shortId = parsed.pathname.split("/").filter(Boolean)[0];
      return shortId || null;
    }

    const watchId = parsed.searchParams.get("v");
    if (watchId) {
      return watchId;
    }

    if (parsed.pathname.startsWith("/embed/")) {
      const embedId = parsed.pathname.split("/").filter(Boolean)[1];
      return embedId || null;
    }

    return null;
  } catch {
    return null;
  }
}
