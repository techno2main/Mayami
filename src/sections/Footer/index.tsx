import { useAdminContent } from "@/admin";

export function Footer() {
  const { content } = useAdminContent();

  return (
    <footer className="bg-ink py-10 text-center text-(--cream)/70">
      <p className="font-poster text-xs uppercase tracking-[0.3em]">{content.footer.line1}</p>
      <p className="mt-2 text-xs">{content.footer.line2}</p>
    </footer>
  );
}
