// app/api/weather/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { cities } = await req.json();
  const apiKey = process.env.YOUR_OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing OpenWeather API key" }, { status: 500 });
  }

  try {
    const weatherData = await Promise.all(
      cities.map(async (city: string) => {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        return await res.json();
      })
    );
    return NextResponse.json(weatherData);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}