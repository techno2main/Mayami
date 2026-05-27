import { useAdminContent } from "@/admin";

export function StickyBar() {
  const { content } = useAdminContent();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-ink bg-(--cream)/95 p-3 backdrop-blur md:hidden">
      <div className="flex gap-2">
        <a href="#stream" className="flex-1 rounded-full border-2 border-ink bg-[oklch(0.88_0.19_95)] px-4 py-3 text-center text-xs font-extrabold uppercase tracking-wider text-ink shadow-[3px_3px_0_var(--ink)]">
          {content.stickyBar.streamLabel}
        </a>
        <a href="#video" className="flex-1 rounded-full border-2 border-ink bg-aqua px-4 py-3 text-center text-xs font-extrabold uppercase tracking-wider text-ink shadow-[3px_3px_0_var(--ink)]">
          {content.stickyBar.videoLabel}
        </a>
        <a href={content.links.tiktok} target="_blank" rel="noreferrer" className="flex-1 rounded-full border-2 border-ink bg-ink px-4 py-3 text-center text-xs font-extrabold uppercase tracking-wider text-cream shadow-[3px_3px_0_var(--magenta)]">
          {content.stickyBar.tiktokLabel}
        </a>
      </div>
    </div>
  );
}
