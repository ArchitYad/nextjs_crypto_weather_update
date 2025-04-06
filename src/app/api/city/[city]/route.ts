import { NextRequest } from "next/server";
import { getCityWeatherData } from "@/lib/getCittyWeatherData";

export async function GET(req: NextRequest, { params }: { params: { city: string } }) {
  const city = params.city;
  const data = await getCityWeatherData(city);

  return Response.json(data);
}