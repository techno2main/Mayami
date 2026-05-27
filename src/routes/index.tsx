import { createFileRoute } from "@tanstack/react-router";
import coverImg from "@/assets/mayami-cover.jpg";
import { Hero } from "@/sections/Hero";
import { Stream } from "@/sections/Stream";
import { Social } from "@/sections/Social";
import { Video } from "@/sections/Video";
import { ReleaseInfo } from "@/sections/ReleaseInfo";
import { Cta } from "@/sections/Cta";
import { Footer } from "@/sections/Footer";
import { StickyBar } from "@/sections/StickyBar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ellene Leya Masri - Mayami, My Miami (New Single)" },
      { name: "description", content: "New single out tomorrow. Stream Mayami, My Miami by Ellene Leya Masri. Watch the official video, follow on TikTok and Instagram." },
      { property: "og:title", content: "Mayami, My Miami - Ellene Leya Masri" },
      { property: "og:description", content: "New single out tomorrow. Stream it, watch it, share it." },
      { property: "og:image", content: coverImg },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: coverImg },
    ],
  }),
  component: Mayami,
});

function Mayami() {
  return (
    <main className="relative overflow-x-clip">
      <Hero />
      <Stream />
      <Social />
      <Video />
      <ReleaseInfo />
      <Cta />
      <Footer />
      <StickyBar />
    </main>
  );
}
