"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
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
const FALLBACK_IMAGE = "/favicon.ico.png";

function toTitleCase(value: string) {
  return value
    .toLocaleLowerCase("pt-BR")
    .split(/(\s+)/)
    .map((part) => {
      if (!part.trim()) return part;
      return part.charAt(0).toLocaleUpperCase("pt-BR") + part.slice(1);
    })
    .join("");
}

export default function Player({ station, stationKey }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [song, setSong] = useState("Carregando...");
  const [artist, setArtist] = useState("");
  const [cover, setCover] = useState(FALLBACK_IMAGE);
  const [lastTitle, setLastTitle] = useState("");
  const [streamError, setStreamError] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!station?.streamUrl) return;
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlaying = () => {
      setIsPlaying(true);
      setStreamError(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setIsPlaying(false);
      setStreamError(true);
    };

    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    setStreamError(false);
    setIsPlaying(false);
    setCover(FALLBACK_IMAGE);
    audio.pause();
    audio.src = station.streamUrl;
    audio.load();
    audio.volume = volume;

    const tryPlay = async () => {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
    };

    tryPlay();

    return () => {
      audio.pause();
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
    };
  }, [station, volume]);

  useEffect(() => {
    if (!stationKey) return;

    const fetchSongInfo = async () => {
      try {
        const res = await fetch(`/api/radios/${stationKey}`);
        const contentType = res.headers.get("content-type") || "";

        if (!res.ok || !contentType.includes("application/json")) {
          throw new Error(`Resposta invalida de /api/radios/${stationKey} (status ${res.status})`);
        }

        const data = await res.json();

        const title = `${data.song} - ${data.artist}`;
        if (title !== lastTitle) {
          setSong(toTitleCase(data.song || "Música desconhecida"));
          setArtist(toTitleCase(data.artist || "Artista desconhecido"));
          setCover(data.image || FALLBACK_IMAGE);
          setLastTitle(title);
        }
      } catch (err) {
        console.error("Erro ao buscar faixa:", err);
      }
    };

    fetchSongInfo();
    const interval = setInterval(fetchSongInfo, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [stationKey, lastTitle]);

  const stationCover = stationKey ? `/radio-nativa-${stationKey}.png` : FALLBACK_IMAGE;

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    setStreamError(false);

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-[#060013]/90 text-white rounded-2xl shadow-2xl border border-[#1a1033] p-6 md:pl-24 relative overflow-hidden">
      {/* Fundo neon */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FD9200]/10 via-[#7D00FF]/10 to-[#00CFFF]/10 blur-3xl animate-pulse opacity-40"></div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
        <span className="text-[#FD9200]">🎵</span> {station?.name ?? "Estação desconhecida"}
      </h2>

      {streamError && (
        <div className="text-center text-red-400 bg-red-900/30 rounded-md p-2 mb-4 border border-red-700">
          ⚠️ Esta estação está temporariamente fora do ar.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start relative z-10">
        {/* 🎧 Capa + Fundo */}
        <div className="col-span-1 flex flex-col items-center gap-4 relative">
          <motion.img
            key={`${stationKey}-bg`}
            src={stationCover}
            alt={`Card da rádio ${station?.name}`}
            className="w-full h-44 rounded-lg object-cover shadow-lg blur-sm opacity-50"
          />

          <motion.img
            key={cover}
            src={cover}
            alt="Capa do Álbum"
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute top-4 w-32 h-32 rounded-xl object-cover shadow-[0_0_25px_#FD9200] border-2 border-[#FD9200]"
          />

          {/* 🎛 Equalizador vertical colorido */}
          <div className="flex items-end gap-1 h-16 justify-center w-full mt-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.span
                key={i}
                className="w-2 rounded"
                style={{
                  background: `linear-gradient(to top, ${
                    i % 2 === 0
                      ? "#FD9200"
                      : i % 3 === 0
                      ? "#7D00FF"
                      : "#00CFFF"
                  }, #ffffff10)`,
                  filter: "drop-shadow(0 0 6px #FD9200)",
                }}
                animate={
                  !isPlaying
                    ? { height: "0.5rem", opacity: 0.2 }
                    : {
                        height: ["1.2rem", "2.4rem", "1.6rem"],
                        opacity: [0.7, 1, 0.9],
                      }
                }
                transition={{
                  duration: 0.7 + i * 0.1,
                  repeat: !isPlaying ? 0 : Infinity,
                  ease: "easeInOut",
                }}
              ></motion.span>
            ))}
          </div>
        </div>

        {/* ℹ️ Informações e controles */}
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
                <p className="font-semibold text-lg text-[#FD9200]">🎶 {song}</p>
                <p className="text-sm text-gray-400">👤 {artist}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Botão Play/Pause visual (mute real) */}
<motion.button
  onClick={togglePlayback}
  title={isPlaying ? "Pausar" : "Tocar"}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  className="
    w-16 h-16 flex items-center justify-center 
    rounded-full bg-[#FD9200] 
    shadow-[0_0_25px_#FD9200] 
    text-white transition relative z-50
    active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FD9200]/50
  "
  style={{ touchAction: "manipulation" }} // 🔹 evita bloqueio no mobile
>
  <AnimatePresence mode="wait">
    <motion.div
      key={isPlaying ? "pause" : "play"}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isPlaying ? <Pause size={32} /> : <Play size={32} />}
    </motion.div>
  </AnimatePresence>
</motion.button>


          {/* 🎚 Volume */}
          <div className="flex items-center gap-2 w-full mt-2">
            <div className="h-1 w-40 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-1 bg-gradient-to-r from-[#FD9200] via-[#7D00FF] to-[#00CFFF]"
                animate={{ width: `${volume * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="opacity-0 absolute pointer-events-none"
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
