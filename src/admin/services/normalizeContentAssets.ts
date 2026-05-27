import artistImg from "@/assets/mayami-artist.jpg";
import coverImg from "@/assets/mayami-cover.jpg";
import textureImg from "@/assets/mayami-texture.jpg";
import type { AdminContent } from "@/admin/types/content";

const KNOWN_ASSETS: Array<{ marker: string; url: string }> = [
  { marker: "mayami-artist", url: artistImg },
  { marker: "mayami-cover", url: coverImg },
  { marker: "mayami-texture", url: textureImg },
];

function normalizeAssetUrl(url: string | undefined) {
  if (!url) return url;

  const raw = url.trim();
  if (!raw) return raw;

  const lower = raw.toLowerCase();

  if (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("data:") ||
    lower.startsWith("blob:")
  ) {
    return raw;
  }

  for (const known of KNOWN_ASSETS) {
    if (lower.includes(known.marker)) {
      return known.url;
    }
  }

  return raw;
}

export function normalizeAdminContentAssets(content: AdminContent): AdminContent {
  return {
    ...content,
    heroSlider: content.heroSlider.map((slide) =>
      slide.type === "image"
        ? {
            ...slide,
            src: normalizeAssetUrl(slide.src) ?? slide.src,
          }
        : {
            ...slide,
            thumbnailSrc: normalizeAssetUrl(slide.thumbnailSrc),
          },
    ),
    social: {
      ...content.social,
      textureImage: normalizeAssetUrl(content.social.textureImage) ?? content.social.textureImage,
    },
    video: {
      ...content.video,
      coverImage: normalizeAssetUrl(content.video.coverImage) ?? content.video.coverImage,
    },
    releaseInfo: {
      ...content.releaseInfo,
      coverImage: normalizeAssetUrl(content.releaseInfo.coverImage) ?? content.releaseInfo.coverImage,
    },
    cta: {
      ...content.cta,
      textureImage: normalizeAssetUrl(content.cta.textureImage) ?? content.cta.textureImage,
    },
  };
}