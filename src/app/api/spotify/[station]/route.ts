export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

/**
 * 🔑 Gera automaticamente o token de acesso do Spotify
 */
async function getSpotifyToken() {
  const client_id = "5a1f6c092f4042d8bcccddf38b838987";
  const client_secret = "9bfef2f5d87d4bf8b6b2063ff422f702";

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro ao gerar token do Spotify:", data);
    throw new Error("Falha ao gerar token do Spotify");
  }

  return data.access_token as string;
}

/**
 * 🔹 Define endpoint local para buscar dados da rádio
 */
const LOCAL_ENDPOINT =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/info`
    : "http://localhost:3000/api/info");

/**
 * ✅ Rota principal - retorna artista, música e capa do Spotify
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ station: string }> }
) {
  const { station } = await context.params;

  try {
    // 1️⃣ Busca as informações da música atual via sua rota local
    const infoRes = await fetch(`${LOCAL_ENDPOINT}/${station}`, { cache: "no-store" });
    const info = await infoRes.json();

    if (info.error) {
      return NextResponse.json({ error: info.error }, { status: 404 });
    }

    // 2️⃣ Gera token do Spotify dinamicamente
    const SPOTIFY_TOKEN = await getSpotifyToken();

    // 3️⃣ Monta query para o Spotify
    const query = `${info.artist} ${info.song}`;
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${SPOTIFY_TOKEN}`,
        },
      }
    );

    const spotifyData = await spotifyRes.json();
    const track = spotifyData.tracks?.items?.[0];

    // 4️⃣ Caso a música seja encontrada no Spotify
    if (track) {
      return NextResponse.json({
        artist: info.artist,
        song: info.song,
        listeners: info.listeners,
        station: info.station,
        album: track.album.name,
        image: track.album.images?.[0]?.url || null,
        preview_url: track.preview_url,
      });
    }

    // 5️⃣ Caso não encontre a faixa
    return NextResponse.json({
      ...info,
      album: null,
      image: null,
      preview_url: null,
    });
  } catch (error) {
    console.error("Erro ao buscar capa no Spotify:", error);
    return NextResponse.json(
      { error: "Falha ao buscar capa da música" },
      { status: 500 }
    );
  }
}
