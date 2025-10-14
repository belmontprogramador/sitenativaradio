"use client";

import Image from "next/image";

export default function DownloadApp() {
  return (
    <div className="w-full flex flex-col items-center text-center py-6">
      {/* Título */}
      <h2 className="text-2xl md:text-4xl font-bold mb-6">
        Baixe o app
      </h2>

      {/* QR Code */}
      <Image
        src="/qrcodeNativa.png" // 👉 salve o QR code na pasta public/
        alt="QR Code para baixar o app"
        width={110}
        height={110}
        className="hover:scale-105 transition rounded-lg shadow-lg"
      />
    </div>
  );
}
