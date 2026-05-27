import { useMemo, useState } from "react";
import { defaultAdminContent } from "@/admin/config/defaultContent";
import { useAdminContent } from "@/admin/hooks/useAdminContent";
import type { AdminSlide } from "@/admin/types/content";
import { Area, Field } from "@/admin/components/AdminFormFields";

type AdminPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const {
    content,
    setContent,
    resetContent,
    cloudEnabled,
    cloudState,
    cloudMessage,
    userEmail,
    signIn,
    signOut,
    loadFromCloud,
    saveToCloud,
  } = useAdminContent();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const platformRows = useMemo(
    () => [
      { key: "spotify", label: "Spotify" },
      { key: "appleMusic", label: "Apple Music" },
      { key: "youtubeMusic", label: "YouTube Music" },
      { key: "deezer", label: "Deezer" },
      { key: "amazonMusic", label: "Amazon Music" },
      { key: "soundcloud", label: "SoundCloud" },
    ] as const,
    [],
  );

  if (!isOpen) return null;

  const updateSlide = (index: number, nextSlide: AdminSlide) => {
    const nextSlides = [...content.heroSlider];
    nextSlides[index] = nextSlide;
    setContent({ ...content, heroSlider: nextSlides });
  };

  return (
    <aside className="fixed inset-0 z-120 bg-ink/60 p-3 backdrop-blur-sm sm:p-6">
      <div className="mx-auto h-full w-full max-w-5xl overflow-y-auto rounded-3xl border-2 border-ink bg-cream p-4 sm:p-6" style={{ boxShadow: "12px 12px 0 var(--ink)" }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Admin Content</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => resetContent()}
              className="rounded-full border-2 border-ink bg-aqua px-4 py-2 font-poster text-xs uppercase tracking-[0.18em] text-ink"
            >
              Reset defaults
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="rounded-full border-2 border-ink bg-[oklch(0.88_0.19_95)] px-4 py-2 font-poster text-xs uppercase tracking-[0.18em] text-ink"
            >
              Close
            </button>
          </div>
        </div>

        <section className="mb-6 rounded-2xl border-2 border-ink bg-background p-4">
          <p className="font-poster text-xs uppercase tracking-[0.2em] text-ink/70">Cloud sync (Supabase)</p>
          {cloudEnabled ? (
            <>
              <p className="mt-1 text-sm text-ink/75">
                {userEmail ? `Connecte: ${userEmail}` : "Non connecte"} · Etat: {cloudState}
              </p>
              {cloudMessage ? <p className="mt-1 text-sm text-ink/75">{cloudMessage}</p> : null}

              {!userEmail ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <Field label="Email" value={emailInput} onChange={setEmailInput} />
                  <Field label="Mot de passe" value={passwordInput} onChange={setPasswordInput} />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => signIn(emailInput, passwordInput)}
                      className="h-10 w-full rounded-full border-2 border-ink bg-aqua px-4 text-xs font-bold uppercase tracking-[0.15em] text-ink"
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void loadFromCloud()}
                    className="rounded-full border-2 border-ink bg-aqua px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-ink"
                  >
                    Load cloud
                  </button>
                  <button
                    type="button"
                    onClick={() => void saveToCloud()}
                    className="rounded-full border-2 border-ink bg-[oklch(0.88_0.19_95)] px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-ink"
                  >
                    Save cloud
                  </button>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="rounded-full border-2 border-ink bg-ink px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-cream"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="mt-1 text-sm text-ink/75">
              Mode local uniquement: configure VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY pour activer le cloud.
            </p>
          )}
        </section>

        <p className="mb-6 text-sm text-ink/70">Le contenu est modifiable ici et sauvegarde localement automatiquement.</p>

        <section className="grid gap-3 sm:grid-cols-2">
          <Field label="Hero - Artiste" value={content.hero.topArtist} onChange={(v) => setContent({ ...content, hero: { ...content.hero, topArtist: v } })} />
          <Field label="Hero - CTA haut" value={content.hero.topCtaLabel} onChange={(v) => setContent({ ...content, hero: { ...content.hero, topCtaLabel: v } })} />
          <Field label="Hero - Badge" value={content.hero.badgeText} onChange={(v) => setContent({ ...content, hero: { ...content.hero, badgeText: v } })} />
          <Field label="Hero - Sous titre" value={content.hero.subtitle} onChange={(v) => setContent({ ...content, hero: { ...content.hero, subtitle: v } })} />
          <Area label="Hero - Description" value={content.hero.description} onChange={(v) => setContent({ ...content, hero: { ...content.hero, description: v } })} />
          <Field label="Bouton Stream - Label" value={content.hero.streamLabel} onChange={(v) => setContent({ ...content, hero: { ...content.hero, streamLabel: v } })} />
          <Field label="Bouton Stream - Lien" value={content.hero.streamHref} onChange={(v) => setContent({ ...content, hero: { ...content.hero, streamHref: v } })} />
          <Field label="Bouton Watch - Label" value={content.hero.watchLabel} onChange={(v) => setContent({ ...content, hero: { ...content.hero, watchLabel: v } })} />
          <Field label="Bouton Watch - Lien" value={content.hero.watchHref} onChange={(v) => setContent({ ...content, hero: { ...content.hero, watchHref: v } })} />
        </section>

        <section className="mt-8">
          <h3 className="font-poster text-xs uppercase tracking-[0.25em] text-ink/70">Hero Slider</h3>
          <div className="mt-3 space-y-4">
            {content.heroSlider.map((slide, index) => (
              <div key={index} className="rounded-2xl border-2 border-ink bg-background p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-poster text-xs uppercase tracking-[0.2em] text-ink">Slide {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => setContent({ ...content, heroSlider: content.heroSlider.filter((_, i) => i !== index) })}
                    className="rounded-full border-2 border-ink bg-ink px-3 py-1 text-xs font-bold uppercase text-cream"
                  >
                    Remove
                  </button>
                </div>
                <select
                  value={slide.type}
                  onChange={(event) => {
                    const nextType = event.target.value as "image" | "video";
                    if (nextType === "image") {
                      updateSlide(index, { type: "image", src: "", alt: slide.alt });
                    } else {
                      updateSlide(index, { type: "video", videoUrl: "", alt: slide.alt });
                    }
                  }}
                  className="w-full rounded-xl border-2 border-ink bg-cream px-3 py-2"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Field
                    label="Alt"
                    value={slide.alt}
                    onChange={(v) => updateSlide(index, { ...slide, alt: v } as AdminSlide)}
                  />
                  {slide.type === "image" ? (
                    <Field
                      label="Image URL"
                      value={slide.src}
                      onChange={(v) => updateSlide(index, { ...slide, src: v })}
                    />
                  ) : (
                    <>
                      <Field
                        label="Video URL"
                        value={slide.videoUrl}
                        onChange={(v) => updateSlide(index, { ...slide, videoUrl: v })}
                      />
                      <Field
                        label="Thumbnail URL (optionnel)"
                        value={slide.thumbnailSrc ?? ""}
                        onChange={(v) => updateSlide(index, { ...slide, thumbnailSrc: v || undefined })}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setContent({ ...content, heroSlider: [...content.heroSlider, { type: "image", src: "", alt: "New image" }] })}
              className="rounded-full border-2 border-ink bg-aqua px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-ink"
            >
              Add image slide
            </button>
            <button
              type="button"
              onClick={() =>
                setContent({
                  ...content,
                  heroSlider: [...content.heroSlider, { type: "video", videoUrl: "", alt: "New video" }],
                })
              }
              className="rounded-full border-2 border-ink bg-[oklch(0.88_0.19_95)] px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-ink"
            >
              Add video slide
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <Field label="Stream - Kicker" value={content.stream.kicker} onChange={(v) => setContent({ ...content, stream: { ...content.stream, kicker: v } })} />
          <Field label="Stream - Title left" value={content.stream.titlePrefix} onChange={(v) => setContent({ ...content, stream: { ...content.stream, titlePrefix: v } })} />
          <Field label="Stream - Title right" value={content.stream.titleHighlight} onChange={(v) => setContent({ ...content, stream: { ...content.stream, titleHighlight: v } })} />
          <Field label="Stream - Availability" value={content.stream.availabilityText} onChange={(v) => setContent({ ...content, stream: { ...content.stream, availabilityText: v } })} />
          <Field label="Stream - Label cards" value={content.stream.cardLabel} onChange={(v) => setContent({ ...content, stream: { ...content.stream, cardLabel: v } })} />
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <Field label="Social - Kicker" value={content.social.kicker} onChange={(v) => setContent({ ...content, social: { ...content.social, kicker: v } })} />
          <Field label="Social - Title left" value={content.social.titleLeft} onChange={(v) => setContent({ ...content, social: { ...content.social, titleLeft: v } })} />
          <Field label="Social - Title right" value={content.social.titleRight} onChange={(v) => setContent({ ...content, social: { ...content.social, titleRight: v } })} />
          <Area label="Social - Description" value={content.social.description} onChange={(v) => setContent({ ...content, social: { ...content.social, description: v } })} />
          <Field label="Social - Texture image URL" value={content.social.textureImage} onChange={(v) => setContent({ ...content, social: { ...content.social, textureImage: v } })} />
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <Field label="Video - Kicker" value={content.video.kicker} onChange={(v) => setContent({ ...content, video: { ...content.video, kicker: v } })} />
          <Field label="Video - Titre" value={content.video.title} onChange={(v) => setContent({ ...content, video: { ...content.video, title: v } })} />
          <Area label="Video - Description" value={content.video.description} onChange={(v) => setContent({ ...content, video: { ...content.video, description: v } })} />
          <Field label="Video - Status" value={content.video.statusText} onChange={(v) => setContent({ ...content, video: { ...content.video, statusText: v } })} />
          <Field label="Video - Button" value={content.video.watchButtonLabel} onChange={(v) => setContent({ ...content, video: { ...content.video, watchButtonLabel: v } })} />
          <Field label="Video - Cover image URL" value={content.video.coverImage} onChange={(v) => setContent({ ...content, video: { ...content.video, coverImage: v } })} />
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <Field label="Release - Kicker" value={content.releaseInfo.kicker} onChange={(v) => setContent({ ...content, releaseInfo: { ...content.releaseInfo, kicker: v } })} />
          <Field label="Release - Title left" value={content.releaseInfo.titleLeft} onChange={(v) => setContent({ ...content, releaseInfo: { ...content.releaseInfo, titleLeft: v } })} />
          <Field label="Release - Title right" value={content.releaseInfo.titleHighlight} onChange={(v) => setContent({ ...content, releaseInfo: { ...content.releaseInfo, titleHighlight: v } })} />
          <Field label="Release - Cover image URL" value={content.releaseInfo.coverImage} onChange={(v) => setContent({ ...content, releaseInfo: { ...content.releaseInfo, coverImage: v } })} />
        </section>

        <section className="mt-8">
          <h3 className="font-poster text-xs uppercase tracking-[0.25em] text-ink/70">Release rows</h3>
          <div className="mt-3 space-y-2">
            {content.releaseInfo.rows.map((row, index) => (
              <div key={`${row.key}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <Field
                  label={`Key ${index + 1}`}
                  value={row.key}
                  onChange={(v) => {
                    const rows = [...content.releaseInfo.rows];
                    rows[index] = { ...rows[index], key: v };
                    setContent({ ...content, releaseInfo: { ...content.releaseInfo, rows } });
                  }}
                />
                <Field
                  label={`Value ${index + 1}`}
                  value={row.value}
                  onChange={(v) => {
                    const rows = [...content.releaseInfo.rows];
                    rows[index] = { ...rows[index], value: v };
                    setContent({ ...content, releaseInfo: { ...content.releaseInfo, rows } });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const rows = content.releaseInfo.rows.filter((_, i) => i !== index);
                    setContent({ ...content, releaseInfo: { ...content.releaseInfo, rows } });
                  }}
                  className="mt-6 h-10 rounded-full border-2 border-ink bg-ink px-3 text-xs font-bold uppercase text-cream"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setContent({
                ...content,
                releaseInfo: {
                  ...content.releaseInfo,
                  rows: [...content.releaseInfo.rows, { key: "New key", value: "New value" }],
                },
              })
            }
            className="mt-3 rounded-full border-2 border-ink bg-aqua px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-ink"
          >
            Add release row
          </button>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <Field label="CTA - Kicker" value={content.cta.kicker} onChange={(v) => setContent({ ...content, cta: { ...content.cta, kicker: v } })} />
          <Field label="CTA - Title left" value={content.cta.titleLeft} onChange={(v) => setContent({ ...content, cta: { ...content.cta, titleLeft: v } })} />
          <Field label="CTA - Title right" value={content.cta.titleRight} onChange={(v) => setContent({ ...content, cta: { ...content.cta, titleRight: v } })} />
          <Area label="CTA - Description" value={content.cta.description} onChange={(v) => setContent({ ...content, cta: { ...content.cta, description: v } })} />
          <Field label="CTA - Hashtag" value={content.cta.hashtag} onChange={(v) => setContent({ ...content, cta: { ...content.cta, hashtag: v } })} />
          <Field label="CTA - Texture image URL" value={content.cta.textureImage} onChange={(v) => setContent({ ...content, cta: { ...content.cta, textureImage: v } })} />
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <Field label="Footer line 1" value={content.footer.line1} onChange={(v) => setContent({ ...content, footer: { ...content.footer, line1: v } })} />
          <Field label="Footer line 2" value={content.footer.line2} onChange={(v) => setContent({ ...content, footer: { ...content.footer, line2: v } })} />
          <Field label="Sticky - Stream label" value={content.stickyBar.streamLabel} onChange={(v) => setContent({ ...content, stickyBar: { ...content.stickyBar, streamLabel: v } })} />
          <Field label="Sticky - Video label" value={content.stickyBar.videoLabel} onChange={(v) => setContent({ ...content, stickyBar: { ...content.stickyBar, videoLabel: v } })} />
          <Field label="Sticky - TikTok label" value={content.stickyBar.tiktokLabel} onChange={(v) => setContent({ ...content, stickyBar: { ...content.stickyBar, tiktokLabel: v } })} />
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <Field label="Lien FFM" value={content.links.ffm} onChange={(v) => setContent({ ...content, links: { ...content.links, ffm: v } })} />
          <Field label="Lien YouTube Video" value={content.links.youtubeVideo} onChange={(v) => setContent({ ...content, links: { ...content.links, youtubeVideo: v } })} />
          <Field label="Lien TikTok" value={content.links.tiktok} onChange={(v) => setContent({ ...content, links: { ...content.links, tiktok: v } })} />
          <Field label="Lien Instagram" value={content.links.instagram} onChange={(v) => setContent({ ...content, links: { ...content.links, instagram: v } })} />
          {platformRows.map((row) => (
            <Field
              key={row.key}
              label={`Lien ${row.label}`}
              value={content.links[row.key]}
              onChange={(v) => setContent({ ...content, links: { ...content.links, [row.key]: v } })}
            />
          ))}
        </section>

        <section className="mt-8 rounded-2xl border-2 border-ink bg-background p-4">
          <p className="font-poster text-xs uppercase tracking-[0.2em] text-ink/70">Export / Import</p>
          <p className="mt-1 text-sm text-ink/75">Copie la configuration et sauvegarde-la ailleurs pour la reutiliser.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(JSON.stringify(content, null, 2));
              }}
              className="rounded-full border-2 border-ink bg-aqua px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-ink"
            >
              Copy JSON
            </button>
            <button
              type="button"
              onClick={() => {
                const input = window.prompt("Colle ici ton JSON admin");
                if (!input) return;
                try {
                  const parsed = JSON.parse(input);
                  setContent(parsed);
                } catch {
                  window.alert("JSON invalide");
                }
              }}
              className="rounded-full border-2 border-ink bg-[oklch(0.88_0.19_95)] px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-ink"
            >
              Import JSON
            </button>
            <button
              type="button"
              onClick={() => setContent(defaultAdminContent)}
              className="rounded-full border-2 border-ink bg-ink px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-cream"
            >
              Restore default JSON
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
}
