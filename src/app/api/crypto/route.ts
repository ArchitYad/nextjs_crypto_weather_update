// app/api/crypto/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { cryptos } = await req.json();
  try {
    const res = await fetch(`https://api.coincap.io/v2/assets?ids=${cryptos.join(",")}`);
    const data = await res.json();
    return NextResponse.json(data.data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch crypto data" }, { status: 500 });
  }
}
