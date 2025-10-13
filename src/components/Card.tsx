"use client";

import Image from "next/image";

type CardProps = {
  src: string;
  alt: string;
  onClick?: () => void;
  active?: boolean;
};

export default function Card({ src, alt, onClick, active }: CardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Tocar ${alt}`}
      className={`relative w-full aspect-square rounded-lg overflow-hidden shadow outline-offset-4 focus:outline-[#fd9200]
        ${active ? "ring-4 ring-[#fd9200]" : "bg-white"}`}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
    </button>
  );
}
