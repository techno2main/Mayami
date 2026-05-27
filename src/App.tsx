import { AdminProvider } from "@/admin";
import { isAdminRoute } from "@/admin/config/route";
import { AdminRoutePage } from "@/admin/components/AdminRoutePage";
import { Hero, HeroMarquee } from "@/sections/Hero";
import { Stream } from "@/sections/Stream";
import { Social } from "@/sections/Social";
import { Video } from "@/sections/Video";
import { ReleaseInfo } from "@/sections/ReleaseInfo";
import { Cta } from "@/sections/Cta";
import { Footer } from "@/sections/Footer";
import { StickyBar } from "@/sections/StickyBar";

export function App() {
  const adminPath = typeof window !== "undefined" && isAdminRoute(window.location.pathname);

  return (
    <AdminProvider>
      {adminPath ? (
        <AdminRoutePage />
      ) : (
        <main className="relative overflow-x-clip">
          <div className="sticky top-0 z-60">
            <HeroMarquee />
          </div>
          <Hero />
          <Stream />
          <Social />
          <Video />
          <ReleaseInfo />
          <Cta />
          <Footer />
          <StickyBar />
        </main>
      )}
    </AdminProvider>
  );
}