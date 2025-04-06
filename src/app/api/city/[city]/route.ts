// app/citys/[city]/route.ts
import { NextRequest } from "next/server";

export async function getCityWeatherData(city: string) {
  const geocode = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`).then(res => res.json());
  const lat = geocode.results?.[0]?.latitude;
  const lon = geocode.results?.[0]?.longitude;

  const forecastRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`);
  const historyRes = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${getPastDate(30)}&end_date=${getToday()}&daily=temperature_2m_max&timezone=auto`);

  const forecastData = await forecastRes.json();
  const historyData = await historyRes.json();

  return {
    forecast: forecastData.daily.time.map((d: any, i: number) => ({
      datetime: d,
      tempmax: forecastData.daily.temperature_2m_max[i],
      tempmin: forecastData.daily.temperature_2m_min[i],
      conditions: mapWeatherCode(forecastData.daily.weathercode[i]),
    })),
    history: historyData.daily.time.map((d: any, i: number) => ({
      date: d,
      temperature: historyData.daily.temperature_2m_max[i],
    })),
  };
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getPastDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function mapWeatherCode(code: number) {
  const codeMap: any = {
    0: "Clear",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Rime Fog",
    51: "Light Drizzle",
    61: "Light Rain",
    71: "Light Snow",
    95: "Thunderstorm",
    // Add more as needed
  };
  return codeMap[code] || "Unknown";
}