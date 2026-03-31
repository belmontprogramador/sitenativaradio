"use client";

import { useEffect, useMemo, useState } from "react";
import BannerPrincipal from "@/components/BannerPrincipal";
import BannerSecundario from "@/components/BannerSecundario";
import Player from "@/components/Player";
import CardGrid from "@/components/CardGrid";
import DownloadApp from "@/components/DownloadApp";

type RadioStation = {
  id: string;
  title: string;
  streamUrl: string;
  apiUrl: string;
  isActive: boolean;
  isDefault: boolean;
  key: string;
};

const COVER_BY_KEY: Record<string, string> = {
  popular: "/radio-nativa-popular.png",
  pagode: "/radio-nativa-pagode.png",
  sertanejo: "/radio-nativa-sertanejo.png",
  gospel: "/radio-nativa-gospel.png",
};

const FALLBACK_COVER = "/favicon.ico.png";

export default function Home() {
  const [radios, setRadios] = useState<RadioStation[]>([]);
  const [stationKey, setStationKey] = useState<string>("");

  useEffect(() => {
    const loadRadios = async () => {
      try {
        const res = await fetch("/api/radios", { cache: "no-store" });
        const contentType = res.headers.get("content-type") || "";

        if (!res.ok || !contentType.includes("application/json")) {
          throw new Error(`Resposta invalida de /api/radios (status ${res.status})`);
        }

        const data = (await res.json()) as RadioStation[];

        if (!Array.isArray(data) || data.length === 0) {
          return;
        }

        setRadios(data);

        const defaultRadio = data.find((radio) => radio.isDefault) || data[0];
        setStationKey(defaultRadio.key);
      } catch (error) {
        console.error("Erro ao carregar radios:", error);
      }
    };

    loadRadios();
  }, []);

  const currentStation = useMemo(() => {
    if (!radios.length || !stationKey) return null;
    const selected = radios.find((radio) => radio.key === stationKey);
    if (!selected) return null;
    return { name: selected.title, streamUrl: selected.streamUrl };
  }, [radios, stationKey]);

  const cards = radios.map((radio) => ({
    src: COVER_BY_KEY[radio.key] || FALLBACK_COVER,
    alt: radio.title,
    onClick: () => setStationKey(radio.key),
    active: radio.key === stationKey,
  }));

  return (
    <main className="w-full min-h-screen bg-black text-white space-y-6 p-4 md:p-8">
      <BannerPrincipal />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:items-center">
        <Player station={currentStation} stationKey={stationKey} />


        <div className="flex flex-col space-y-6">
          <div className="flex justify-center md:justify-start">
            <BannerSecundario />
          </div>
          <CardGrid cards={cards} />
        </div>
      </div>

      <DownloadApp />
    </main>
  );
}
