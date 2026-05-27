import logoImg from "@/assets/mayami-logo.png";

export function MayamiLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoImg}
      alt="Mayami"
      width={1600}
      height={620}
      className={`inline-block h-auto w-full select-none ${className}`}
      draggable={false}
    />
  );
}
