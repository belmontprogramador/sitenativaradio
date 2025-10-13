"use client";

import { useMemo, useState } from "react";
import BannerPrincipal from "@/components/BannerPrincipal";
import BannerSecundario from "@/components/BannerSecundario";
import Player from "@/components/Player";
import CardGrid from "@/components/CardGrid";
import DownloadApp from "@/components/DownloadApp";

type StationKey = "popular" | "sertanejo" | "gospel" | "pagode";

const STATIONS = [
  { key: "popular" as StationKey,   name: "Nativa Popular",   baseUrl: "https://stm1.playstm.com:7018", cover: "/radio-nativa-popular.png" },
  { key: "pagode" as StationKey,    name: "Nativa Pagode",    baseUrl: "https://stm1.playstm.com:7022", cover: "/radio-nativa-pagode.png" },
  { key: "sertanejo" as StationKey, name: "Nativa Sertanejo", baseUrl: "https://stm1.playstm.com:7014", cover: "/radio-nativa-sertanejo.png" },
  { key: "gospel" as StationKey,    name: "Nativa Gospel",    baseUrl: "https://stm1.playstm.com:7016", cover: "/radio-nativa-gospel.png" },
];

export default function Home() {
  const [stationKey, setStationKey] = useState<StationKey>("popular");

  const currentStation = useMemo(() => {
    const s = STATIONS.find((st) => st.key === stationKey)!;
    return { name: s.name, streamUrl: `${s.baseUrl}/stream` };
  }, [stationKey]);

  const cards = STATIONS.map((s) => ({
    src: s.cover,
    alt: s.name,
    onClick: () => setStationKey(s.key),
    active: s.key === stationKey,
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
