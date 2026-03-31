"use client";

import { useEffect, useState } from "react";

type SiteBanner = {
  id: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
};

const ROTATE_INTERVAL_MS = 8000;
const FALLBACK_BANNER = "/BannerPrincipal.png";

export default function BannerPrincipal() {
  const [banners, setBanners] = useState<SiteBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetch("/api/site-banner", { cache: "no-store" });
        const contentType = res.headers.get("content-type") || "";

        if (!res.ok || !contentType.includes("application/json")) {
          throw new Error(`Resposta invalida de /api/site-banner (status ${res.status})`);
        }

        const data = (await res.json()) as SiteBanner[];

        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        } else {
          setBanners([]);
        }
      } catch (error) {
        console.error("Erro ao carregar banners:", error);
        setBanners([]);
      }
    };

    loadBanners();

    const refreshInterval = setInterval(loadBanners, ROTATE_INTERVAL_MS);

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [banners]);

  useEffect(() => {
    if (!banners.length) return;
    setCurrentIndex((prev) => prev % banners.length);
  }, [banners]);

  const currentBanner = banners[currentIndex];
  const imageSrc = currentBanner?.imageUrl || FALLBACK_BANNER;
  const imageAlt = currentBanner?.title || "Banner Principal";

  return (
    <div className="relative w-full h-32 md:h-48 rounded-lg shadow overflow-hidden">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover"
        loading="eager"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_BANNER;
        }}
      />
    </div>
  );
}
