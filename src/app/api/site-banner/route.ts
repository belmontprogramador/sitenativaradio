import { NextResponse } from "next/server";
import { getSiteBanners } from "@/lib/siteBanners";

export async function GET() {
  try {
    const banners = await getSiteBanners();
    const activeBanners = banners.filter((banner) => banner.isActive);

    return NextResponse.json(activeBanners, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Erro ao carregar banners do site:", error);
    return NextResponse.json(
      { error: "Falha ao carregar banners" },
      { status: 500 }
    );
  }
}