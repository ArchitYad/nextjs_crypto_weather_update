const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function getWeatherData() {
    const res = await fetch(`${baseUrl}/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cities: ["New York", "London", "Tokyo"] }),
      next: { revalidate: 3600 },
    });
    return res.json();
  }
  
  export async function getCryptoData(retries = 1): Promise<any[]> {
    try {
      const res = await fetch(`${baseUrl}/api/crypto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cryptos: ["bitcoin", "ethereum", "cardano"] }),
        next: { revalidate: 3600 }, 
      });
  
      const data = await res.json();
  
      if (Array.isArray(data) && data.length === 0 && retries > 0) {
        console.warn("Empty crypto data received, retrying...");
        return await getCryptoData(retries - 1);
      }
  
      return data;
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      return [];
    }
  }
  
  
  export async function getNewsData() {
    const res = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 3600 },
    });
    return res.json();
  }  