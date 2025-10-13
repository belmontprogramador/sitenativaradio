import Image from "next/image";

export default function BannerPrincipal() {
  return (
    <div className="relative w-full h-32 md:h-48 rounded-lg shadow overflow-hidden">
      <Image
        src="/BannerPrincipal.png"   // 🔹 coloque sua imagem aqui (pasta public/)
        alt="Banner Principal"
        fill                          // faz a imagem preencher todo o container
        className="object-cover"      // cobre mantendo proporção
        priority                      // carrega antes (para performance)
      />
    </div>
  );
}
