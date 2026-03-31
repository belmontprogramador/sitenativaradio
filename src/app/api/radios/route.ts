import { NextResponse } from "next/server";
import { getRadios } from "@/lib/radios";

export async function GET() {
  try {
    const radios = await getRadios();
    const activeRadios = radios.filter((radio) => radio.isActive);

    return NextResponse.json(activeRadios, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Erro ao carregar radios:", error);
    return NextResponse.json(
      { error: "Falha ao carregar radios" },
      { status: 500 }
    );
  }
}