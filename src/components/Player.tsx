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

export default function Player({ station, stationKey }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [song, setSong] = useState("Carregando...");
  const [artist, setArtist] = useState("");
  const [cover, setCover] = useState(FALLBACK_IMAGE);
  const [lastTitle, setLastTitle] = useState("");
  const [streamError, setStreamError] = useState(false);

  /* 🎚 Volume e mute */
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.muted = isMuted;
    audioRef.current.volume = volume;
  }, [isMuted, volume]);

  /* 🎧 Stream */
  useEffect(() => {
    if (!station?.streamUrl || !audioRef.current) return;

    const audio = audioRef.current;

    audio.pause();
    setStreamError(false);

    audio.src = station.streamUrl;
    audio.load();

    const tryPlay = async () => {
      try {
        await audio.play();
      } catch (err: any) {
        // Autoplay bloqueado → comportamento normal
        if (
          err?.name === "NotAllowedError" ||
          err?.name === "AbortError"
        ) {
          return;
        }

        setStreamError(true);
      }
    };

    audio.onerror = () => setStreamError(true);
    audio.onstalled = () => setStreamError(true);

    tryPlay();

    return () => {
      audio.pause();
      audio.onerror = null;
      audio.onstalled = null;
    };
  }, [station]);

  /* 🎵 Spotify */
  useEffect(() => {
    const fetchSongInfo = async () => {
      try {
        const res = await fetch(`/api/spotify/${stationKey}`);
        if (!res.ok) return;

        const data = await res.json();
        const title = `${data.song} - ${data.artist}`;

        if (title !== lastTitle) {
          setSong(data.song || "Música desconhecida");
          setArtist(data.artist || "Artista desconhecido");
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

  /* ▶️ Clique do usuário */
  const toggleMute = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      try {
        await audio.play();
      } catch {
        setStreamError(true);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl bg-[#060013]/90 text-white rounded-2xl shadow-2xl border border-[#1a1033] p-6 md:pl-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FD9200]/10 via-[#7D00FF]/10 to-[#00CFFF]/10 blur-3xl animate-pulse opacity-40"></div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
        <span className="text-[#FD9200]">🎵</span>{" "}
        {station?.name ?? "Estação desconhecida"}
      </h2>

      {streamError && (
        <div className="text-center text-red-400 bg-red-900/30 rounded-md p-2 mb-4 border border-red-700">
          ⚠️ Não foi possível reproduzir o áudio no momento.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start relative z-10">
        {/* 🎧 Capa */}
        <div className="col-span-1 flex flex-col items-center gap-4 relative">
          <motion.img
            src={`/radio-nativa-${stationKey}.png`}
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

          {/* 🎛 Equalizador */}
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
                  isMuted
                    ? { height: "0.5rem", opacity: 0.2 }
                    : {
                        height: [
                          "0.5rem",
                          "2.5rem",
                          "1.5rem",
                        ],
                        opacity: [0.7, 1, 0.9],
                      }
                }
                transition={{
                  duration: 0.8,
                  repeat: isMuted ? 0 : Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>

        {/* ℹ️ Info */}
        <div className="col-span-2 flex flex-col items-center md:items-start gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={song + artist}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-semibold text-lg text-[#FD9200]">
                🎶 {song}
              </p>
              <p className="text-sm text-gray-400">👤 {artist}</p>
            </motion.div>
          </AnimatePresence>

          {/* ▶️ Botão */}
          <motion.button
            onClick={toggleMute}
            title={isMuted ? "Ativar som" : "Silenciar"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-[#FD9200] shadow-[0_0_25px_#FD9200] text-white relative z-50"
          >
            {isMuted ? <Play size={32} /> : <Pause size={32} />}
          </motion.button>

          <OuvintesAoVivo />
        </div>
      </div>

      <audio ref={audioRef} preload="auto" />
    </div>
  );
}
