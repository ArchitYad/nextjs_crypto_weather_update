import CityPageClient from "./client_page";

export const revalidate = 1800;

export default async function CityPage({ params }: { params: { city: string } }) {
  const city = params.city;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/city/${city}`, {
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch city weather data");
  }

  const data = await res.json();

  return (
    <CityPageClient
      city={city}
      forecastData={data.forecast}
      historicalData={data.history}
    />
  );
}