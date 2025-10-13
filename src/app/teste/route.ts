export const dynamic = "force-dynamic";

export async function GET() {
  return new Response("Servidor Node ativo ✅", { status: 200 });
}
