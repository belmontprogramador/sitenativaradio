const EXTERNAL_BANNERS_URL =
  process.env.SITE_BANNER_API_URL || "https://api.nativaon.com/api/site-banner";
const EXTERNAL_BANNERS_TOKEN =
  process.env.SITE_BANNER_API_TOKEN || "nativaoamordobrasil";
const BANNERS_CACHE_TTL_MS = 60 * 1000;
const BANNERS_ASSET_BASE_URL =
  process.env.SITE_BANNER_ASSET_BASE_URL || "https://api.nativaon.com";

export type SiteBanner = {
  id: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
  updatedAt: string;
};

type SiteBannersCache = {
  data: SiteBanner[];
  expiresAt: number;
};

declare global {
  var __siteBannersCache: SiteBannersCache | undefined;
}

function toStringValue(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function toNumberValue(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toBooleanValue(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "ativo", "active"].includes(normalized)) return true;
    if (["false", "0", "inativo", "inactive"].includes(normalized)) return false;
  }
  return fallback;
}

function toArrayPayload(payload: unknown) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.items)) return obj.items;
    return [payload];
  }
  return [];
}

function toAbsoluteAssetUrl(pathOrUrl: string) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${BANNERS_ASSET_BASE_URL}${normalizedPath}`;
}

function appendVersionToUrl(url: string, updatedAt: string) {
  if (!url || !updatedAt) return url;

  const version = Date.parse(updatedAt);
  if (Number.isNaN(version)) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${version}`;
}

function resolveImageUrl(item: Record<string, unknown>, updatedAt: string) {
  const rawPath =
    toStringValue(item.imageUrl) ||
    toStringValue(item.bannerUrl) ||
    toStringValue(item.image) ||
    toStringValue(item.path) ||
    toStringValue(item.url) ||
    toStringValue(item.src);

  const absoluteUrl = toAbsoluteAssetUrl(rawPath);
  return appendVersionToUrl(absoluteUrl, updatedAt);
}

function parseSiteBanners(payload: unknown): SiteBanner[] {
  return toArrayPayload(payload)
    .filter((item) => item && typeof item === "object")
    .map((item, index) => {
      const raw = item as Record<string, unknown>;

      const id = toStringValue(raw.id) || toStringValue(raw._id);
      const title = toStringValue(raw.title) || "Banner";
      const updatedAt = toStringValue(raw.updatedAt);
      const imageUrl = resolveImageUrl(raw, updatedAt);
      const isActive = toBooleanValue(raw.isActive ?? raw.status, true);
      const order = toNumberValue(raw.order ?? raw.position ?? raw.sortOrder, index);

      return {
        id,
        title,
        imageUrl,
        isActive,
        order,
        updatedAt,
      } satisfies SiteBanner;
    })
    .filter((banner) => Boolean(banner.id && banner.imageUrl))
    .sort((a, b) => a.order - b.order);
}

export async function getSiteBanners(options?: { forceRefresh?: boolean }) {
  const now = Date.now();
  const shouldUseCache =
    !options?.forceRefresh &&
    globalThis.__siteBannersCache &&
    globalThis.__siteBannersCache.expiresAt > now;

  if (shouldUseCache) {
    return globalThis.__siteBannersCache.data;
  }

  const response = await fetch(EXTERNAL_BANNERS_URL, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${EXTERNAL_BANNERS_TOKEN}`,
    },
  });
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok || !contentType.includes("application/json")) {
    throw new Error(`Falha ao obter banners externos: ${response.status}`);
  }

  const payload = await response.json();
  const banners = parseSiteBanners(payload);

  globalThis.__siteBannersCache = {
    data: banners,
    expiresAt: now + BANNERS_CACHE_TTL_MS,
  };

  return banners;
}