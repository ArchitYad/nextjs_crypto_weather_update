import { fetchWeatherData } from "@/lib/getWeatherData";
import { fetchCryptoData } from "@/lib/cryptoService";
import { fetchNewsData } from "@/lib/newsService";
export async function getWeatherData() {
  return await fetchWeatherData(["New York", "London", "Tokyo"]);
}
export async function getCryptoData(retries = 1): Promise<any[]> {
  try {
    const data = await fetchCryptoData(["bitcoin", "ethereum", "cardano"]);

    if (Array.isArray(data) && data.length === 0 && retries > 0) {
      console.warn("Empty crypto data received, retrying...");
      return await getCryptoData(retries - 1);
    }

    return data;
  } catch (error) {
    console.error("Error in getCryptoData:", error);
    return [];
  }
}
  
export async function getNewsData(): Promise<any[]> {
  return await fetchNewsData();
}