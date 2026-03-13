import type { NextApiRequest, NextApiResponse } from "next";

const baseUrlMap: Record<string, string> = {
  gospel: "https://stmplay.com/listen/nativagospel",
  popular: "https://stmplay.com/listen/nativapopular",
  sertanejo: "https://stmplay.com/listen/nativasertanejo",
  pagode: "https://stmplay.com/listen/nativapagode",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { station } = req.query;

  if (!station || typeof station !== "string") {
    return res.status(400).json({ error: "Station inválida" });
  }

  const baseUrl = baseUrlMap[station];

  if (!baseUrl) {
    return res.status(404).json({ error: "Rádio não encontrada" });
  }

  try {
    const response = await fetch(`${baseUrl}/stats?sid=1&json=1`);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar stats" });
  }
}
