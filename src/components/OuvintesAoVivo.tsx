"use client";

import { useEffect, useState } from "react";

export default function OuvintesAoVivo() {
  const [ouvintes, setOuvintes] = useState(1503);

  useEffect(() => {
    const interval = setInterval(() => {
      setOuvintes((prev) => {
        // Gera um valor aleatório de -50 a +50
        const variacao = Math.floor(Math.random() * 100 - 50);
        let novoValor = prev + variacao;

        // Mantém entre 1500 e 2500
        if (novoValor < 1500) novoValor = 1500;
        if (novoValor > 2500) novoValor = 2500;

        return novoValor;
      });
    }, 120000); // ⏰ altera a cada 2 minutos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-2 text-sm text-gray-300 flex items-center gap-2">
      👥 {ouvintes.toLocaleString("pt-BR")} ouvintes ao vivo
    </div>
  );
}
