// app/citys/[city]/page.ts

import { getCityWeatherData } from "@/lib/getCittyWeatherData";
import CityPageClient from "./client_page";

export const revalidate = 1800;

// Define the type for props with a Promise
interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

export default async function CityPage({ params }: PageProps) {
  const { city } = await params; // Await the promised params

  const data = await getCityWeatherData(city);

  return (
    <CityPageClient
      city={city}
      forecastData={data.forecast}
      historicalData={data.history}
    />
  );
}