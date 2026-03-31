const EXTERNAL_RADIOS_URL = process.env.RADIOS_API_URL || "https://api.nativaon.com/api/radios";
const EXTERNAL_RADIOS_TOKEN =
  process.env.RADIOS_API_TOKEN || "nativaoamordobrasil";
const CACHE_TTL_MS = 60 * 1000;
const DEEZER_SEARCH_URL = "https://api.deezer.com/search";
const DEEZER_CACHE_TTL_MS = 10 * 60 * 1000;

export type RadioStation = {
  id: string;
  title: string;
  streamUrl: string;
  apiUrl: string;
  isActive: boolean;
  isDefault: boolean;
  key: string;
};

type RadiosCache = {
  data: RadioStation[];
  expiresAt: number;
};

type DeezerCacheEntry = {
  image: string | null;
  expiresAt: number;
};

declare global {
  var __radiosCache: RadiosCache | undefined;
  var __deezerCache: Record<string, DeezerCacheEntry> | undefined;
}

function toStationKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

function normalizeTrackValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function getTrackCacheKey(artist: string, song: string) {
  return `${normalizeTrackValue(artist)}::${normalizeTrackValue(song)}`;
}

function parseRadios(payload: unknown): RadioStation[] {
  if (!Array.isArray(payload)) return [];

  return payload
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const radio = item as {
        id?: string;
        title?: string;
        streamUrl?: string;
        apiUrl?: string;
        isActive?: boolean;
        isDefault?: boolean;
      };

      const title = (radio.title || "").trim();

      return {
        id: radio.id || "",
        title,
        streamUrl: radio.streamUrl || "",
        apiUrl: radio.apiUrl || "",
        isActive: Boolean(radio.isActive),
        isDefault: Boolean(radio.isDefault),
        key: toStationKey(title),
      } satisfies RadioStation;
    })
    .filter((radio) => Boolean(radio.id && radio.title && radio.streamUrl && radio.apiUrl && radio.key));
}

export async function getRadios(options?: { forceRefresh?: boolean }) {
  const now = Date.now();
  const shouldUseCache =
    !options?.forceRefresh &&
    globalThis.__radiosCache &&
    globalThis.__radiosCache.expiresAt > now;

  if (shouldUseCache) {
    return globalThis.__radiosCache.data;
  }

  const response = await fetch(EXTERNAL_RADIOS_URL, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${EXTERNAL_RADIOS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao obter radios externas: ${response.status}`);
  }

  const payload = await response.json();
  const radios = parseRadios(payload);

  globalThis.__radiosCache = {
    data: radios,
    expiresAt: now + CACHE_TTL_MS,
  };

  return radios;
}

export function findRadioByStation(radios: RadioStation[], station: string) {
  const normalizedStation = toStationKey(station);
  return radios.find((radio) => radio.key === normalizedStation);
}

export async function getDeezerAlbumCover(artist: string, song: string) {
  if (!artist || !song) {
    return null;
  }

  const cacheKey = getTrackCacheKey(artist, song);
  const now = Date.now();
  const cachedEntry = globalThis.__deezerCache?.[cacheKey];

  if (cachedEntry && cachedEntry.expiresAt > now) {
    return cachedEntry.image;
  }

  const query = `artist:"${artist}" track:"${song}"`;
  const response = await fetch(`${DEEZER_SEARCH_URL}?q=${encodeURIComponent(query)}`, {
    cache: "no-store",
  });
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok || !contentType.includes("application/json")) {
    throw new Error(`Falha ao buscar capa no Deezer: ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{
      album?: {
        cover_xl?: string | null;
        cover_big?: string | null;
        cover_medium?: string | null;
        cover?: string | null;
      };
    }>;
  };

  const image =
    payload.data?.[0]?.album?.cover_xl ||
    payload.data?.[0]?.album?.cover_big ||
    payload.data?.[0]?.album?.cover_medium ||
    payload.data?.[0]?.album?.cover ||
    null;

  globalThis.__deezerCache = {
    ...(globalThis.__deezerCache || {}),
    [cacheKey]: {
      image,
      expiresAt: now + DEEZER_CACHE_TTL_MS,
    },
  };

  return image;
}