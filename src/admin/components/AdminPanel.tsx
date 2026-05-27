import { useMemo, useState, type ReactNode } from "react";
import { defaultAdminContent } from "@/admin/config/defaultContent";
import { useAdminContent } from "@/admin/hooks/useAdminContent";
import type { AdminSlide } from "@/admin/types/content";
import { Area, Field, MediaField } from "@/admin/components/AdminFormFields";
import { uploadMediaFile } from "@/admin/services/mediaStorageService";

const ADMIN_SECTIONS = [
  { id: "admin-cloud", label: "Cloud" },
  { id: "admin-hero", label: "Hero" },
  { id: "admin-slider", label: "Slider" },
  { id: "admin-stream", label: "Stream" },
  { id: "admin-social", label: "Social" },
  { id: "admin-video", label: "Video" },
  { id: "admin-release", label: "Release" },
  { id: "admin-release-rows", label: "Release Rows" },
  { id: "admin-cta", label: "CTA" },
  { id: "admin-footer", label: "Footer" },
  { id: "admin-links", label: "Links" },
  { id: "admin-export", label: "Export" },
] as const;

type AdminSectionId = (typeof ADMIN_SECTIONS)[number]["id"];

function getInitialOpenSections(): Record<AdminSectionId, boolean> {
  return ADMIN_SECTIONS.reduce(
    (acc, section) => {
      acc[section.id] = false;
      return acc;
    },
    {} as Record<AdminSectionId, boolean>,
  );
}

export function AdminPanel() {
  const {
    content,
    setContent,
    locale,
    setLocale,
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
  const [mediaStatus, setMediaStatus] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<AdminSectionId, boolean>>(getInitialOpenSections);
  const [activeSection, setActiveSection] = useState<AdminSectionId>("admin-cloud");

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

  const updateSlide = (index: number, nextSlide: AdminSlide) => {
    const nextSlides = [...content.heroSlider];
    nextSlides[index] = nextSlide;
    setContent({ ...content, heroSlider: nextSlides });
  };

  const toggleSection = (id: AdminSectionId) => {
    setOpenSections((current) => ({ ...current, [id]: !current[id] }));
    setActiveSection(id);
  };

  const openSection = (id: AdminSectionId) => {
    setOpenSections((current) => ({ ...current, [id]: true }));
    setActiveSection(id);
  };

  const uploadToMediaLibrary = async (file: File, folder: string) => {
    if (!cloudEnabled) {
      throw new Error("Enable Supabase configuration before uploading media.");
    }

    if (!userEmail) {
      throw new Error("Sign in to Supabase before uploading media.");
    }

    setMediaStatus(`Uploading ${file.name}...`);
    try {
      const uploadedUrl = await uploadMediaFile(file, folder);
      setMediaStatus(`Uploaded: ${file.name}`);
      return uploadedUrl;
    } catch (error) {
      setMediaStatus(error instanceof Error ? error.message : "Upload failed.");
      throw error;
    }
  };

  return (
    <main className="min-h-screen bg-[oklch(0.31_0.11_25)] px-3 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border-2 border-ink bg-cream p-4 sm:p-6" style={{ boxShadow: "12px 12px 0 var(--ink)" }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">Admin Content</h2>
            <span className="rounded-full border-2 border-ink bg-background px-3 py-1 font-poster text-[10px] uppercase tracking-[0.15em] text-ink/80">
              {userEmail ? `Connected: ${userEmail}` : "Not signed in"}
            </span>
            <div className="ml-1 flex overflow-hidden rounded-full border-2 border-ink">
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`px-2 py-1 font-poster text-[10px] uppercase tracking-[0.15em] ${locale === "en" ? "bg-ink text-cream" : "bg-background text-ink"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("fr")}
                className={`px-2 py-1 font-poster text-[10px] uppercase tracking-[0.15em] ${locale === "fr" ? "bg-ink text-cream" : "bg-background text-ink"}`}
              >
                FR
              </button>
            </div>
          </div>
        </div>

        <nav className="-mx-4 sticky top-0 z-20 mb-6 border-2 border-ink bg-cream px-3 py-2 sm:-mx-6">
          <div className="flex items-center justify-between gap-2 sm:hidden">
            <p className="font-poster text-[10px] uppercase tracking-[0.2em] text-ink/70">Admin sections</p>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle admin sections menu"
              className="rounded-full border-2 border-ink bg-aqua px-3 py-1 font-poster text-[10px] uppercase tracking-[0.15em] text-ink"
            >
              {mobileMenuOpen ? "Close" : "Menu"}
            </button>
          </div>

          <div className="hidden flex-wrap gap-2 sm:flex">
            {ADMIN_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => openSection(section.id)}
                className={`rounded-full border-2 border-ink px-3 py-1 font-poster text-[10px] uppercase tracking-[0.15em] text-ink transition hover:bg-aqua ${activeSection === section.id ? "bg-aqua" : "bg-background"}`}
              >
                {section.label}
              </a>
            ))}
          </div>

          {mobileMenuOpen ? (
            <div className="mt-2 grid grid-cols-2 gap-2 sm:hidden">
              {ADMIN_SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => {
                    openSection(section.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-full border-2 border-ink px-3 py-1 text-center font-poster text-[10px] uppercase tracking-[0.15em] text-ink ${activeSection === section.id ? "bg-aqua" : "bg-background"}`}
                >
                  {section.label}
                </a>
              ))}
            </div>
          ) : null}
        </nav>

        <CollapsibleSection
          id="admin-cloud"
          title="Cloud Sync (Supabase)"
          isOpen={openSections["admin-cloud"]}
          isActive={activeSection === "admin-cloud"}
          onToggle={() => toggleSection("admin-cloud")}
          className="mb-6"
        >
          {cloudEnabled ? (
            <>
              <p className="text-sm text-ink/75">
                {userEmail ? `Connected: ${userEmail}` : "Not signed in"} · State: {cloudState}
              </p>
              {cloudMessage ? <p className="mt-1 text-sm text-ink/75">{cloudMessage}</p> : null}
              {mediaStatus ? <p className="mt-1 text-sm text-ink/75">{mediaStatus}</p> : null}

              {!userEmail ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <Field label="Email" value={emailInput} onChange={setEmailInput} />
                  <Field label="Password" value={passwordInput} onChange={setPasswordInput} />
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
            <p className="text-sm text-ink/75">
              Local mode only: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable cloud sync.
            </p>
          )}
        </CollapsibleSection>

        <p className="mb-6 text-sm text-ink/70">
          {cloudEnabled
            ? "You can edit content here. Changes are auto-saved locally, then synced to cloud with SAVE CLOUD."
            : "You can edit content here. Changes are auto-saved locally."}
        </p>

        <CollapsibleSection
          id="admin-hero"
          title="Hero"
          isOpen={openSections["admin-hero"]}
          isActive={activeSection === "admin-hero"}
          onToggle={() => toggleSection("admin-hero")}
        >
          <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Hero - Artist" value={content.hero.topArtist} onChange={(v) => setContent({ ...content, hero: { ...content.hero, topArtist: v } })} />
          <Field label="Hero - Top CTA" value={content.hero.topCtaLabel} onChange={(v) => setContent({ ...content, hero: { ...content.hero, topCtaLabel: v } })} />
          <Field label="Hero - Badge" value={content.hero.badgeText} onChange={(v) => setContent({ ...content, hero: { ...content.hero, badgeText: v } })} />
          <Field label="Hero - Subtitle" value={content.hero.subtitle} onChange={(v) => setContent({ ...content, hero: { ...content.hero, subtitle: v } })} />
          <Area label="Hero - Description" value={content.hero.description} onChange={(v) => setContent({ ...content, hero: { ...content.hero, description: v } })} />
          <Field label="Stream Button - Label" value={content.hero.streamLabel} onChange={(v) => setContent({ ...content, hero: { ...content.hero, streamLabel: v } })} />
          <Field label="Stream Button - Link" value={content.hero.streamHref} onChange={(v) => setContent({ ...content, hero: { ...content.hero, streamHref: v } })} />
          <Field label="Watch Button - Label" value={content.hero.watchLabel} onChange={(v) => setContent({ ...content, hero: { ...content.hero, watchLabel: v } })} />
          <Field label="Watch Button - Link" value={content.hero.watchHref} onChange={(v) => setContent({ ...content, hero: { ...content.hero, watchHref: v } })} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="admin-slider"
          title="Hero Slider"
          isOpen={openSections["admin-slider"]}
          isActive={activeSection === "admin-slider"}
          onToggle={() => toggleSection("admin-slider")}
        >
          <div className="mt-3 space-y-4">
            {content.heroSlider.map((slide, index) => (
              <div key={index} className="rounded-2xl border-2 border-ink bg-background p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-poster text-xs uppercase tracking-[0.2em] text-ink">Slide {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm(`Remove slide ${index + 1}?`)) return;
                      setContent({ ...content, heroSlider: content.heroSlider.filter((_, i) => i !== index) });
                    }}
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
                    <MediaField
                      label="Image URL"
                      value={slide.src}
                      onChange={(v) => updateSlide(index, { ...slide, src: v })}
                      onUpload={(file) => uploadToMediaLibrary(file, "slider")}
                      helperText="Use an external image URL or upload directly to Supabase Storage."
                    />
                  ) : (
                    <>
                      <Field
                        label="Video URL"
                        value={slide.videoUrl}
                        onChange={(v) => updateSlide(index, { ...slide, videoUrl: v })}
                      />
                      <MediaField
                        label="Thumbnail URL (optional)"
                        value={slide.thumbnailSrc ?? ""}
                        onChange={(v) => updateSlide(index, { ...slide, thumbnailSrc: v || undefined })}
                        onUpload={(file) => uploadToMediaLibrary(file, "slider-thumbnails")}
                        helperText="Optional. Leave empty to auto-generate thumbnail from YouTube URL."
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
        </CollapsibleSection>

        <CollapsibleSection
          id="admin-stream"
          title="Stream"
          isOpen={openSections["admin-stream"]}
          isActive={activeSection === "admin-stream"}
          onToggle={() => toggleSection("admin-stream")}
        >
          <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Stream - Kicker" value={content.stream.kicker} onChange={(v) => setContent({ ...content, stream: { ...content.stream, kicker: v } })} />
          <Field label="Stream - Title left" value={content.stream.titlePrefix} onChange={(v) => setContent({ ...content, stream: { ...content.stream, titlePrefix: v } })} />
          <Field label="Stream - Title right" value={content.stream.titleHighlight} onChange={(v) => setContent({ ...content, stream: { ...content.stream, titleHighlight: v } })} />
          <Field label="Stream - Availability" value={content.stream.availabilityText} onChange={(v) => setContent({ ...content, stream: { ...content.stream, availabilityText: v } })} />
          <Field label="Stream - Label cards" value={content.stream.cardLabel} onChange={(v) => setContent({ ...content, stream: { ...content.stream, cardLabel: v } })} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="admin-social"
          title="Social"
          isOpen={openSections["admin-social"]}
          isActive={activeSection === "admin-social"}
          onToggle={() => toggleSection("admin-social")}
        >
          <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Social - Kicker" value={content.social.kicker} onChange={(v) => setContent({ ...content, social: { ...content.social, kicker: v } })} />
          <Field label="Social - Title left" value={content.social.titleLeft} onChange={(v) => setContent({ ...content, social: { ...content.social, titleLeft: v } })} />
          <Field label="Social - Title right" value={content.social.titleRight} onChange={(v) => setContent({ ...content, social: { ...content.social, titleRight: v } })} />
          <Area label="Social - Description" value={content.social.description} onChange={(v) => setContent({ ...content, social: { ...content.social, description: v } })} />
          <MediaField
            label="Social - Texture image URL"
            value={content.social.textureImage}
            onChange={(v) => setContent({ ...content, social: { ...content.social, textureImage: v } })}
            onUpload={(file) => uploadToMediaLibrary(file, "social")}
            helperText="Either paste an external URL or upload to Supabase Storage."
          />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="admin-video"
          title="Video"
          isOpen={openSections["admin-video"]}
          isActive={activeSection === "admin-video"}
          onToggle={() => toggleSection("admin-video")}
        >
          <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Video - Kicker" value={content.video.kicker} onChange={(v) => setContent({ ...content, video: { ...content.video, kicker: v } })} />
          <Field label="Video - Title" value={content.video.title} onChange={(v) => setContent({ ...content, video: { ...content.video, title: v } })} />
          <Area label="Video - Description" value={content.video.description} onChange={(v) => setContent({ ...content, video: { ...content.video, description: v } })} />
          <Field label="Video - Status" value={content.video.statusText} onChange={(v) => setContent({ ...content, video: { ...content.video, statusText: v } })} />
          <Field label="Video - Button" value={content.video.watchButtonLabel} onChange={(v) => setContent({ ...content, video: { ...content.video, watchButtonLabel: v } })} />
          <MediaField
            label="Video - Cover image URL"
            value={content.video.coverImage}
            onChange={(v) => setContent({ ...content, video: { ...content.video, coverImage: v } })}
            onUpload={(file) => uploadToMediaLibrary(file, "video")}
            helperText="Either paste an external URL or upload to Supabase Storage."
          />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="admin-release"
          title="Release"
          isOpen={openSections["admin-release"]}
          isActive={activeSection === "admin-release"}
          onToggle={() => toggleSection("admin-release")}
        >
          <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Release - Kicker" value={content.releaseInfo.kicker} onChange={(v) => setContent({ ...content, releaseInfo: { ...content.releaseInfo, kicker: v } })} />
          <Field label="Release - Title left" value={content.releaseInfo.titleLeft} onChange={(v) => setContent({ ...content, releaseInfo: { ...content.releaseInfo, titleLeft: v } })} />
          <Field label="Release - Title right" value={content.releaseInfo.titleHighlight} onChange={(v) => setContent({ ...content, releaseInfo: { ...content.releaseInfo, titleHighlight: v } })} />
          <MediaField
            label="Release - Cover image URL"
            value={content.releaseInfo.coverImage}
            onChange={(v) => setContent({ ...content, releaseInfo: { ...content.releaseInfo, coverImage: v } })}
            onUpload={(file) => uploadToMediaLibrary(file, "release")}
            helperText="Either paste an external URL or upload to Supabase Storage."
          />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="admin-release-rows"
          title="Release Rows"
          isOpen={openSections["admin-release-rows"]}
          isActive={activeSection === "admin-release-rows"}
          onToggle={() => toggleSection("admin-release-rows")}
        >
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
                    if (!window.confirm(`Remove release row ${index + 1}?`)) return;
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
        </CollapsibleSection>

        <CollapsibleSection
          id="admin-cta"
          title="CTA"
          isOpen={openSections["admin-cta"]}
          isActive={activeSection === "admin-cta"}
          onToggle={() => toggleSection("admin-cta")}
        >
          <div className="grid gap-3 sm:grid-cols-2">
          <Field label="CTA - Kicker" value={content.cta.kicker} onChange={(v) => setContent({ ...content, cta: { ...content.cta, kicker: v } })} />
          <Field label="CTA - Title left" value={content.cta.titleLeft} onChange={(v) => setContent({ ...content, cta: { ...content.cta, titleLeft: v } })} />
          <Field label="CTA - Title right" value={content.cta.titleRight} onChange={(v) => setContent({ ...content, cta: { ...content.cta, titleRight: v } })} />
          <Area label="CTA - Description" value={content.cta.description} onChange={(v) => setContent({ ...content, cta: { ...content.cta, description: v } })} />
          <Field label="CTA - Hashtag" value={content.cta.hashtag} onChange={(v) => setContent({ ...content, cta: { ...content.cta, hashtag: v } })} />
          <MediaField
            label="CTA - Texture image URL"
            value={content.cta.textureImage}
            onChange={(v) => setContent({ ...content, cta: { ...content.cta, textureImage: v } })}
            onUpload={(file) => uploadToMediaLibrary(file, "cta")}
            helperText="Either paste an external URL or upload to Supabase Storage."
          />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="admin-footer"
          title="Footer"
          isOpen={openSections["admin-footer"]}
          isActive={activeSection === "admin-footer"}
          onToggle={() => toggleSection("admin-footer")}
        >
          <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Footer line 1" value={content.footer.line1} onChange={(v) => setContent({ ...content, footer: { ...content.footer, line1: v } })} />
          <Field label="Footer line 2" value={content.footer.line2} onChange={(v) => setContent({ ...content, footer: { ...content.footer, line2: v } })} />
          <Field label="Sticky - Stream label" value={content.stickyBar.streamLabel} onChange={(v) => setContent({ ...content, stickyBar: { ...content.stickyBar, streamLabel: v } })} />
          <Field label="Sticky - Video label" value={content.stickyBar.videoLabel} onChange={(v) => setContent({ ...content, stickyBar: { ...content.stickyBar, videoLabel: v } })} />
          <Field label="Sticky - TikTok label" value={content.stickyBar.tiktokLabel} onChange={(v) => setContent({ ...content, stickyBar: { ...content.stickyBar, tiktokLabel: v } })} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="admin-links"
          title="Links"
          isOpen={openSections["admin-links"]}
          isActive={activeSection === "admin-links"}
          onToggle={() => toggleSection("admin-links")}
        >
          <div className="grid gap-3 sm:grid-cols-2">
          <Field label="FFM Link" value={content.links.ffm} onChange={(v) => setContent({ ...content, links: { ...content.links, ffm: v } })} />
          <Field label="YouTube Video Link" value={content.links.youtubeVideo} onChange={(v) => setContent({ ...content, links: { ...content.links, youtubeVideo: v } })} />
          <Field label="TikTok Link" value={content.links.tiktok} onChange={(v) => setContent({ ...content, links: { ...content.links, tiktok: v } })} />
          <Field label="Instagram Link" value={content.links.instagram} onChange={(v) => setContent({ ...content, links: { ...content.links, instagram: v } })} />
          {platformRows.map((row) => (
            <Field
              key={row.key}
              label={`${row.label} Link`}
              value={content.links[row.key]}
              onChange={(v) => setContent({ ...content, links: { ...content.links, [row.key]: v } })}
            />
          ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="admin-export"
          title="Export / Import"
          isOpen={openSections["admin-export"]}
          isActive={activeSection === "admin-export"}
          onToggle={() => toggleSection("admin-export")}
          className="mb-0"
        >
          <p className="text-sm text-ink/75">Copy your configuration and keep a backup to reuse it later.</p>
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
                const input = window.prompt("Paste your admin JSON here");
                if (!input) return;
                try {
                  const parsed = JSON.parse(input);
                  setContent(parsed);
                } catch {
                  window.alert("Invalid JSON");
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
        </CollapsibleSection>
      </div>
    </main>
  );
}

type CollapsibleSectionProps = {
  id: AdminSectionId;
  title: string;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
};

function CollapsibleSection({ id, title, isOpen, isActive, onToggle, children, className }: CollapsibleSectionProps) {
  return (
    <section id={id} className={`scroll-mt-28 mt-8 rounded-2xl border-2 border-ink p-4 ${isActive ? "bg-aqua/20" : "bg-background"} ${className ?? ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="font-poster text-xs uppercase tracking-[0.25em] text-ink/80">{title}</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-cream text-sm font-bold text-ink">
          {isOpen ? "-" : "+"}
        </span>
      </button>
      {isOpen ? <div className="mt-3">{children}</div> : null}
    </section>
  );
}
