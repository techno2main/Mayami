import artistImg from "@/assets/mayami-artist.jpg";
import coverImg from "@/assets/mayami-cover.jpg";
import { YOUTUBE_VIDEO_LINK } from "@/config/links";

const LIVE_VIDEO_LINK = "https://www.youtube.com/watch?v=WiB_UoexqVo";

export type HeroSlide =
  | {
      type: "image";
      src: string;
      alt: string;
    }
  | {
      type: "video";
      alt: string;
      videoUrl: string;
      thumbnailSrc?: string;
    };

// Edite ce tableau pour ajouter/supprimer des photos et videos dans le slider Hero.
export const heroSlides: HeroSlide[] = [
  { type: "image", src: artistImg, alt: "Ellene Leya Masri — portrait 1" },
  { type: "image", src: coverImg, alt: "Ellene Leya Masri — portrait 2" },
  {
    type: "video",
    alt: "Mayami official video",
    videoUrl: YOUTUBE_VIDEO_LINK,
  },
  {
    type: "video",
    alt: "Mayami live session",
    videoUrl: LIVE_VIDEO_LINK,
  },
];
