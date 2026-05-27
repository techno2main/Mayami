const fallbackPath = "/mayami-console-x9k2";

export function getAdminRoutePath() {
  const raw = import.meta.env.VITE_ADMIN_ROUTE_PATH?.trim();
  if (!raw) return fallbackPath;
  if (raw.startsWith("/")) return raw;
  return `/${raw}`;
}

export function isAdminRoute(pathname: string) {
  const target = getAdminRoutePath().replace(/\/+$/, "") || "/";
  const current = pathname.replace(/\/+$/, "") || "/";
  return current === target;
}
