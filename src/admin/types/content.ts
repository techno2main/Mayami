export type AdminSlide =
  | {
      type: "image";
      src: string;
      alt: string;
    }
  | {
      type: "video";
      videoUrl: string;
      alt: string;
      thumbnailSrc?: string;
    };

export type AdminContent = {
  hero: {
    topArtist: string;
    topCtaLabel: string;
    badgeText: string;
    subtitle: string;
    description: string;
    streamLabel: string;
    streamHref: string;
    watchLabel: string;
    watchHref: string;
  };
  marquee: {
    items: Array<{ label: string; href: string; external: boolean }>;
  };
  heroSlider: AdminSlide[];
  stream: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    availabilityText: string;
    cardLabel: string;
  };
  social: {
    kicker: string;
    titleLeft: string;
    titleRight: string;
    description: string;
    textureImage: string;
  };
  video: {
    kicker: string;
    title: string;
    description: string;
    statusText: string;
    watchButtonLabel: string;
    coverImage: string;
  };
  releaseInfo: {
    kicker: string;
    titleLeft: string;
    titleHighlight: string;
    coverImage: string;
    rows: Array<{ key: string; value: string }>;
  };
  cta: {
    kicker: string;
    titleLeft: string;
    titleRight: string;
    description: string;
    textureImage: string;
    hashtag: string;
  };
  footer: {
    line1: string;
    line2: string;
  };
  stickyBar: {
    streamLabel: string;
    videoLabel: string;
    tiktokLabel: string;
  };
  links: {
    ffm: string;
    spotify: string;
    appleMusic: string;
    youtubeMusic: string;
    deezer: string;
    amazonMusic: string;
    soundcloud: string;
    youtubeVideo: string;
    tiktok: string;
    instagram: string;
  };
};

export type AdminSyncState = "idle" | "loading" | "saving" | "error";
