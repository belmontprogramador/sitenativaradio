import Image from "next/image";

export default function BannerSecundario() {
  return (
    <div className="relative w-full h-24 md:h-32 rounded-lg shadow overflow-hidden">
      <Image
        src="/BannerSecundario.png"   // 🔹 coloque a imagem em /public/banner-secundario.jpg
        alt="Banner Secundário"
        fill
        className="object-cover"
      />
    </div>
  );
}
