import { getCityWeatherData } from "@/app/api/city/[city]/route";
import CityPageClient from "./client_page";

export const revalidate = 1800;

export default async function CityPage({ params }: { params: { city: string } }) {
  const city = params.city;
  const data = await getCityWeatherData(city);

  return (
    <CityPageClient
      city={city}
      forecastData={data.forecast}
      historicalData={data.history}
    />
  );
}