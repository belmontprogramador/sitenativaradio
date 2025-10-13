"use client";

import { useEffect } from "react";

export default function DownloadPage() {
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    if (/android/i.test(ua)) {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.belmontprogramador.radionativaonstreaming";
    } else if (/iphone|ipad|ipod/i.test(ua)) {
      window.location.href =
        "https://apps.apple.com/br/app/nativa-onstreaming/id6741536881";
    } else {
      window.location.href = "https://google.com";
    }
  }, []);

  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fafafa",
        color: "#333",
        textAlign: "center",
      }}
    >
      <p>Redirecionando para a loja do seu dispositivo...</p>
    </main>
  );
}
