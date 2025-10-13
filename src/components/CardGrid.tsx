"use client";

import Card from "./Card";

type CardGridProps = {
  cards: { src: string; alt: string; onClick?: () => void; active?: boolean }[];
};

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} {...card} />
      ))}
    </div>
  );
}
