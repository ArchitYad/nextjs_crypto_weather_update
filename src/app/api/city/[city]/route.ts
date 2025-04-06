import { NextRequest } from "next/server";
import { getCityWeatherData } from "@/lib/getCittyWeatherData";

// Use `context` as the second argument and destructure from it
export async function GET(req: NextRequest, context: { params: { city: string } }) {
  const { city } = context.params;

  const data = await getCityWeatherData(city);
  return Response.json(data);
}