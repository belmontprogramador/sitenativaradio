"use client";

import { useEffect, useState } from "react";

const MIN_OUVINTES = 150000;
const MAX_OUVINTES = 180000;
const MIN_INTERVAL_MS = 3 * 60 * 1000;
const MAX_INTERVAL_MS = 5 * 60 * 1000;

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function OuvintesAoVivo() {
  const [ouvintes, setOuvintes] = useState(MIN_OUVINTES);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextUpdate = () => {
      const nextDelay = getRandomInt(MIN_INTERVAL_MS, MAX_INTERVAL_MS);

      timeoutId = setTimeout(() => {
        setOuvintes(getRandomInt(MIN_OUVINTES, MAX_OUVINTES));
        scheduleNextUpdate();
      }, nextDelay);
    };

    setOuvintes(getRandomInt(MIN_OUVINTES, MAX_OUVINTES));
    scheduleNextUpdate();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="mt-2 text-sm text-gray-300 flex items-center gap-2">
      👥 {ouvintes.toLocaleString("pt-BR")} ouvintes ao vivo
    </div>
  );
}
