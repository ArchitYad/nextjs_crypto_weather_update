// app/api/news/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.YOUR_NEWSDATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing News API key" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://newsdata.io/api/1/latest?apikey=${apiKey}&q=cryptocurrency&language=en`);
    const data = await res.json();
    return NextResponse.json(data.results.slice(0, 5));
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
