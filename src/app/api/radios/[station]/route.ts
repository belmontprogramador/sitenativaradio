export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { findRadioByStation, getDeezerAlbumCover, getRadios } from "@/lib/radios";

export async function GET(
  request: Request,
  context: { params: Promise<{ station: string }> }
) {
  const { station } = await context.params;

  try {
    const radios = await getRadios();
    const targetRadio = findRadioByStation(radios, station);
    const url = targetRadio?.apiUrl;

    if (!url) {
      return NextResponse.json({ error: "Estação inválida" }, { status: 404 });
    }

    const res = await fetch(url, { cache: "no-store" });
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok || !contentType.includes("application/json")) {
      throw new Error(`Resposta invalida da API de status (status ${res.status})`);
    }

    const data = await res.json();
    const title = data.songtitle || "";
    const [artist, song] = title.split(" - ");
    const parsedArtist = artist?.trim() || "Artista desconhecido";
    const parsedSong = song?.trim() || "Música desconhecida";

    let image: string | null = null;

    try {
      image = await getDeezerAlbumCover(parsedArtist, parsedSong);
    } catch (error) {
      console.error("Erro ao buscar capa no Deezer:", error);
    }

    return NextResponse.json({
      artist: parsedArtist,
      song: parsedSong,
      listeners: data.currentlisteners || 0,
      station: data.servertitle || targetRadio.title || station,
      streamUrl: targetRadio.streamUrl,
      apiUrl: targetRadio.apiUrl,
      isDefault: targetRadio.isDefault,
      image,
    });
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return NextResponse.json(
      { error: "Falha ao obter informações" },
      { status: 500 }
    );
  }
}