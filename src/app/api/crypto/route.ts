// app/api/crypto/route.ts
import { NextResponse } from "next/server";
import { fetchCryptoData } from "@/lib/cryptoService";

export async function POST(req: Request) {
  const { cryptos } = await req.json();

  try {
    const data = await fetchCryptoData(cryptos);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch crypto data" }, { status: 500 });
  }
}