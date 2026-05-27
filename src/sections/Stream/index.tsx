import { useAdminContent } from "@/admin";
import { useRef, useState } from "react";
import { FaAmazon, FaApple, FaDeezer, FaSoundcloud, FaSpotify, FaYoutube } from "react-icons/fa6";

export function Stream() {
  const { content } = useAdminContent();
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);

  const platforms = [
    { name: "Spotify", href: content.links.spotify, tag: "Stream", cls: "btn-aqua" },
    { name: "Apple Music", href: content.links.appleMusic, tag: "Listen", cls: "btn-cream" },
    { name: "YouTube Music", href: content.links.youtubeMusic, tag: "Play", cls: "btn-magenta" },
    { name: "Deezer", href: content.links.deezer, tag: "Stream", cls: "btn-ink" },
    { name: "Amazon Music", href: content.links.amazonMusic, tag: "Listen", cls: "btn-aqua" },
    { name: "SoundCloud", href: content.links.soundcloud, tag: "Play", cls: "btn-cream" },
  ];

  const selectedPlatform = platforms.find((p) => p.name === activePlatform);
  const selectedEmbed = selectedPlatform ? buildPlatformEmbed(selectedPlatform.name, selectedPlatform.href) : null;

  return (
    <section id="stream" className="relative bg-[#6a1b78] py-20 sm:py-28">
      <div className="absolute inset-0 grain" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-poster text-xs uppercase tracking-[0.3em] text-cream/80">{content.stream.kicker}</p>
            <h2 className="mt-2 font-display text-4xl leading-[0.9] text-cream sm:text-6xl">
              {content.stream.titlePrefix} <span style={{ WebkitTextStroke: "0.5px #13f7bc", color: "#410b49" }}>{content.stream.titleHighlight}</span>
            </h2>
          </div>
          <span className="hidden font-poster text-sm uppercase tracking-[0.2em] text-cream/80 sm:block">
            {content.stream.availabilityText}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((p, i) => {
            const isActive = p.name === activePlatform;
            const embed = buildPlatformEmbed(p.name, p.href);

            return (
              <div key={p.name} className="space-y-3">
                <a
                  href={p.href}
                  target={undefined}
                  rel={undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    setActivePlatform((current) => {
                      const next = current === p.name ? null : p.name;
                      if (next) {
                        requestAnimationFrame(() => {
                          const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;
                          if (isMobile) {
                            document
                              .getElementById(toPlayerAnchorId(next))
                              ?.scrollIntoView({ behavior: "smooth", block: "start" });
                            return;
                          }
                          playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        });
                      }
                      return next;
                    });
                  }}
                  aria-expanded={isActive}
                  className="group relative flex items-center justify-between rounded-2xl border-2 border-ink bg-cream px-6 py-5 text-ink transition hover:-translate-y-1 hover:-translate-x-0.5"
                  style={{ boxShadow: "6px 6px 0 var(--ink)" }}
                >
                  <div>
                    <p className="font-poster text-[10px] uppercase tracking-[0.25em] opacity-70">{content.stream.cardLabel}</p>
                    <p className="flex items-center gap-2 font-display text-2xl leading-none">
                      <span className="text-[0.9em]" style={{ color: getPlatformBrandColor(p.name) }} aria-hidden="true">
                        <PlatformIcon platformName={p.name} />
                      </span>
                      <span>{p.name}</span>
                    </p>
                  </div>
                  <span className="font-poster text-2xl transition group-hover:translate-x-1">→</span>
                </a>

                {isActive && embed ? (
                  <div id={toPlayerAnchorId(p.name)} className="overflow-hidden rounded-2xl border-2 border-ink bg-cream p-2 sm:hidden" style={{ boxShadow: "6px 6px 0 var(--ink)" }}>
                    <iframe
                      title={`${p.name} player`}
                      src={embed.src}
                      width="100%"
                      height={embed.height}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                ) : null}

                {isActive && !embed ? (
                  <div id={toPlayerAnchorId(p.name)} className="rounded-2xl border-2 border-ink bg-cream p-5 sm:hidden" style={{ boxShadow: "6px 6px 0 var(--ink)" }}>
                    <p className="font-poster text-sm uppercase tracking-[0.2em] text-ink">{p.name}</p>
                    <p className="mt-2 text-sm text-(--ink)/75">
                      This platform does not provide a reliable embeddable player. Open it in a new tab.
                    </p>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-aqua px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-ink"
                    >
                      Open {p.name} ↗
                    </a>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {selectedPlatform && selectedEmbed ? (
          <div ref={playerRef} className="mt-6 hidden overflow-hidden rounded-2xl border-2 border-ink bg-cream p-2 sm:block" style={{ boxShadow: "6px 6px 0 var(--ink)" }}>
            <iframe
              title={`${selectedPlatform.name} player`}
              src={selectedEmbed.src}
              width="100%"
              height={selectedEmbed.height}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        ) : selectedPlatform ? (
          <div ref={playerRef} className="mt-6 hidden rounded-2xl border-2 border-ink bg-cream p-5 sm:block" style={{ boxShadow: "6px 6px 0 var(--ink)" }}>
            <p className="font-poster text-sm uppercase tracking-[0.2em] text-ink">{selectedPlatform.name}</p>
            <p className="mt-2 text-sm text-(--ink)/75">
              This platform does not provide a reliable embeddable player. Open it in a new tab.
            </p>
            <a
              href={selectedPlatform.href}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-aqua px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-ink"
            >
              Open {selectedPlatform.name} ↗
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function buildPlatformEmbed(platformName: string, url?: string) {
  if (!url) return null;

  if (platformName === "Spotify") {
    const spotify = buildSpotifyEmbedUrl(url);
    return spotify ? { src: spotify, height: 352 } : null;
  }

  if (platformName === "Apple Music") {
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.includes("music.apple.com")) return null;
      return { src: `https://embed.music.apple.com${parsed.pathname}${parsed.search}`, height: 352 };
    } catch {
      return null;
    }
  }

  if (platformName === "YouTube Music") {
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.includes("youtube.com")) return null;
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "user" && parts[1]) {
        return { src: `https://www.youtube.com/embed?listType=user_uploads&list=${encodeURIComponent(parts[1])}`, height: 352 };
      }
      if (parts[0] === "channel" && parts[1]) {
        return { src: `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(parts[1])}`, height: 352 };
      }
      return null;
    } catch {
      return null;
    }
  }

  if (platformName === "Deezer") {
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.includes("deezer.com")) return null;
      const parts = parsed.pathname.split("/").filter(Boolean);
      const typeIndex = parts.findIndex((p) => ["artist", "album", "track", "playlist"].includes(p));
      const type = typeIndex >= 0 ? parts[typeIndex] : null;
      const id = typeIndex >= 0 ? parts[typeIndex + 1] : null;
      if (!type || !id) return null;
      return { src: `https://widget.deezer.com/widget/dark/${type}/${id}`, height: 352 };
    } catch {
      return null;
    }
  }

  if (platformName === "SoundCloud") {
    return {
      src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&show_user=true`,
      height: 352,
    };
  }

  return null;
}

function toPlayerAnchorId(platformName: string) {
  return `stream-player-${platformName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function PlatformIcon({ platformName }: { platformName: string }) {
  if (platformName === "Spotify") return <FaSpotify />;
  if (platformName === "Apple Music") return <FaApple />;
  if (platformName === "YouTube Music") return <FaYoutube />;
  if (platformName === "Deezer") return <FaDeezer />;
  if (platformName === "Amazon Music") return <FaAmazon />;
  if (platformName === "SoundCloud") return <FaSoundcloud />;
  return null;
}

function getPlatformBrandColor(platformName: string) {
  if (platformName === "Spotify") return "#1DB954";
  if (platformName === "Apple Music") return "#FC3C44";
  if (platformName === "YouTube Music") return "#FF0000";
  if (platformName === "Deezer") return "#A238FF";
  if (platformName === "Amazon Music") return "#00A8E1";
  if (platformName === "SoundCloud") return "#FF5500";
  return "currentColor";
}

function buildSpotifyEmbedUrl(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("spotify.com")) return null;

    const segments = parsed.pathname
      .split("/")
      .filter(Boolean);

    const localeRegex = /^(?:[a-z]{2}(?:-[a-z]{2})?|intl-[a-z]{2})$/i;
    const startIndex = segments[0] && localeRegex.test(segments[0]) ? 1 : 0;
    const type = segments[startIndex];
    const id = segments[startIndex + 1];

    if (!type || !id) return null;
    if (!["artist", "album", "track", "playlist"].includes(type)) return null;

    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
  } catch {
    return null;
  }
}
