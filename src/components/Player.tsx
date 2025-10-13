"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OuvintesAoVivo from "./OuvintesAoVivo";

type PlayerProps = {
  station: {
    name: string;
    streamUrl: string;
  } | null;
  stationKey: string;
};

const REFRESH_INTERVAL = 15000;

export default function Player({ station, stationKey }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [song, setSong] = useState("Carregando...");
  const [artist, setArtist] = useState("");
  const [cover, setCover] = useState("/logo.png");
  const [lastTitle, setLastTitle] = useState("");
  const [streamError, setStreamError] = useState(false);

  // 🔊 Atualiza volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // 🔄 Troca de estação
  useEffect(() => {
    if (!station?.streamUrl) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setStreamError(false);
    audio.src = station.streamUrl;
    audio.load();

    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setStreamError(true);
        setIsPlaying(false);
      }
    };

    tryPlay();
    return () => audio.pause();
  }, [station]);

  // ⏱ Atualiza música periodicamente (sem warnings)
  useEffect(() => {
    async function fetchSongInfo() {
      try {
        const res = await fetch(`/api/info/${stationKey}`);
        const data = await res.json();

        const title = `${data.song} - ${data.artist}`;
        if (title !== lastTitle) {
          setSong(data.song || "Música desconhecida");
          setArtist(data.artist || "Artista desconhecida");
          setCover(data.cover || "/logo.png");
          setLastTitle(title);
        }
      } catch (err) {
        console.error("Erro ao buscar info:", err);
      }
    }

    fetchSongInfo();
    const interval = setInterval(fetchSongInfo, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [stationKey, lastTitle]);

  // ▶️ / ⏸ Controle de play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  // 🧩 UI
  return (
    <div className="w-full max-w-4xl bg-gray-900/70 text-white rounded-lg shadow p-6 md:pl-24">
      <h2 className="text-xl font-bold mb-4">
        🎵 {station?.name ?? "Estação desconhecida"}
      </h2>

      {streamError && (
        <div className="text-center text-red-400 bg-red-900/30 rounded-md p-2 mb-4 border border-red-700">
          ⚠️ Esta estação está temporariamente fora do ar.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* 🎧 Capa dinâmica com fundo da rádio */}
        <div className="col-span-1 flex flex-col items-center gap-4 relative">
          {/* Fundo com card da rádio */}
          <motion.img
            key={stationKey + "-bg"}
            src={`/radio-nativa-${stationKey}.png`}
            alt={`Card da rádio ${station?.name}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-44 rounded-md object-cover shadow-md blur-sm opacity-50"
          />

          {/* Capa da música (Spotify) */}
          <motion.img
            key={cover}
            src={cover}
            alt="Capa do Álbum"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute top-4 w-32 h-32 rounded-md object-cover shadow-lg border-2 border-[#fd9200]"
          />

          {/* Equalizador visual */}
          <div className="flex items-end gap-1 h-16 justify-center w-full mt-2">
            <span className="w-2 bg-[#fd9200] rounded animate-pulse h-8"></span>
            <span className="w-2 bg-[#fd9200] rounded animate-bounce h-6"></span>
            <span className="w-2 bg-[#fd9200] rounded animate-pulse h-12"></span>
            <span className="w-2 bg-[#fd9200] rounded animate-bounce h-5"></span>
            <span className="w-2 bg-[#fd9200] rounded animate-pulse h-9"></span>
          </div>
        </div>

        {/* ℹ️ Info + controles */}
        <div className="col-span-2 flex flex-col items-center md:items-start gap-4">
          <div className="text-center md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={song + artist}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="font-semibold text-lg">🎶 {song}</p>
                <p className="text-sm text-gray-400">👤 {artist}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-[#fd9200] text-white shadow-lg hover:scale-105 transition"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>

          <div className="flex items-center gap-2 w-full">
            <Volume2 size={20} />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-40 accent-[#fd9200]"
            />
          </div>

          <div className="mt-2 text-sm text-gray-300">
            <OuvintesAoVivo />
          </div>
        </div>
      </div>

      <audio ref={audioRef} preload="auto" />
    </div>
  );
}
