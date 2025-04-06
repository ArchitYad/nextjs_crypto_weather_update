import { getCityWeatherData } from "@/lib/getCittyWeatherData";

export async function GET(req: Request, { params }: { params: { city: string } }) {
  const city = params.city;
  const data = await getCityWeatherData(city);

  return Response.json(data);
}