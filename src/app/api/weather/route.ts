// app/api/weather/route.ts
import { NextResponse } from "next/server";
import { fetchWeatherData } from "@/lib/getWeatherData";

export async function POST(req: Request) {
  const { cities } = await req.json();

  try {
    const weatherData = await fetchWeatherData(cities);
    return NextResponse.json(weatherData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}