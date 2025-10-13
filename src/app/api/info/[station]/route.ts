export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const ENDPOINTS: Record<string, string> = {
  popular: "https://stm1.playstm.com:7018/stats?sid=1&json=1",
  sertanejo: "https://stm1.playstm.com:7014/stats?sid=1&json=1",
  gospel: "https://stm1.playstm.com:7016/stats?sid=1&json=1",
  pagode: "https://stm1.playstm.com:7022/stats?sid=1&json=1",
};

// ✅ NOVO FORMATO compatível com Next.js 15
export async function GET(
  request: Request,
  context: { params: Promise<{ station: string }> }
) {
  const { station } = await context.params;
  const url = ENDPOINTS[station];

  if (!url) {
    return NextResponse.json({ error: "Estação inválida" }, { status: 404 });
  }

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    const title = data.songtitle || "";
    const [artist, song] = title.split(" - ");

    return NextResponse.json({
      artist: artist?.trim() || "Artista desconhecido",
      song: song?.trim() || "Música desconhecida",
      listeners: data.currentlisteners || 0,
      station: data.servertitle || station,
    });
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return NextResponse.json(
      { error: "Falha ao obter informações" },
      { status: 500 }
    );
  }
}
