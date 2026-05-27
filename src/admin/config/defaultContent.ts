import artistImg from "@/assets/mayami-artist.jpg";
import coverImg from "@/assets/mayami-cover.jpg";
import textureImg from "@/assets/mayami-texture.jpg";
import type { AdminContent } from "@/admin/types/content";

export const defaultAdminContent: AdminContent = {
  hero: {
    topArtist: "Ellene Leya Masri",
    topCtaLabel: "Out tomorrow",
    badgeText: "New Single · Out Tomorrow",
    subtitle: "Mayami, My Miami",
    description:
      "A sunset-soaked love letter to the city. Stream it, watch it, share it — and follow the journey from the painted walls of Miami.",
    streamLabel: "◉ Stream",
    streamHref: "https://ffm.to/mayami",
    watchLabel: "▶ Watch",
    watchHref: "#video",
  },
  marquee: {
    items: [
      { label: "Mayami, My Miami", href: "#hero", external: false },
      { label: "Out Tomorrow", href: "#stream", external: false },
      { label: "Ellene Leya Masri", href: "https://www.tiktok.com/@ellenemasri", external: true },
      { label: "Stream · Watch · Share", href: "#video", external: false },
    ],
  },
  heroSlider: [
    { type: "image", src: artistImg, alt: "Ellene Leya Masri — portrait 1" },
    { type: "image", src: coverImg, alt: "Ellene Leya Masri — portrait 2" },
    {
      type: "video",
      alt: "Mayami official video",
      videoUrl: "https://www.youtube.com/watch?v=WiB_UoexqVo&pp=0gcJCQoLAYcqIYzv",
    },
  ],
  stream: {
    kicker: "01 / Listen",
    titlePrefix: "Stream",
    titleHighlight: "MAYAMI",
    availabilityText: "Available everywhere",
    cardLabel: "Listen on",
  },
  social: {
    kicker: "02 / Follow",
    titleLeft: "Join the",
    titleRight: "journey",
    description: "Snippets, behind-the-scenes, dance challenges — drop into the daily Miami diary.",
    textureImage: textureImg,
  },
  video: {
    kicker: "03 / Watch",
    title: "Official Video",
    description: "A love letter to Miami — shot on sunset walls, neon boulevards and the Atlantic shoreline.",
    statusText: "Coming soon",
    watchButtonLabel: "Watch on YouTube",
    coverImage: coverImg,
  },
  releaseInfo: {
    kicker: "04 / Release Info",
    titleLeft: "The",
    titleHighlight: "credits",
    coverImage: coverImg,
    rows: [
      { key: "Artists", value: "Richard Bona & Ellene Masri" },
      { key: "Title", value: "Mayami, My Miami" },
      { key: "Release date", value: "May 29th" },
      { key: "Location", value: "Miami, USA" },
      { key: "Video", value: "Coming soon" },
    ],
  },
  cta: {
    kicker: "05 / Don't sleep on it",
    titleLeft: "Press",
    titleRight: "play.",
    description: "Stream the single. Watch the video. Tag and ride the wave.",
    textureImage: textureImg,
    hashtag: "#MayamiMyMiami",
  },
  footer: {
    line1: "© Ellene Leya Masri · Miami, USA",
    line2: "Mayami, My Miami — a release campaign.",
  },
  stickyBar: {
    streamLabel: "▶ Stream",
    videoLabel: "◉ Video",
    tiktokLabel: "TikTok",
  },
  links: {
    ffm: "https://ffm.to/mayami",
    spotify: "https://open.spotify.com/intl-fr/artist/2c6x9IL7EvoUU6XQ642S8c",
    appleMusic: "https://music.apple.com/fr/album/music/1722440356",
    youtubeMusic: "https://www.youtube.com/user/ellenemasriOFFICIAL",
    deezer: "https://www.deezer.com/fr/artist/5316718",
    amazonMusic: "https://music.amazon.fr/artists/B00GBFZTHW/ellene-masri",
    soundcloud: "https://soundcloud.com/ellenemasri",
    youtubeVideo: "https://www.youtube.com/watch?v=WiB_UoexqVo&pp=0gcJCQoLAYcqIYzv",
    tiktok: "https://www.tiktok.com/@ellenemasri",
    instagram: "https://www.instagram.com/ellenemasri/",
  },
};
