// app/api/news/route.ts
import { NextResponse } from "next/server";
import { fetchNewsData } from "@/lib/newsService";

export async function GET() {
  const news = await fetchNewsData();

  if (news.length === 0) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }

  return NextResponse.json(news);
}