// lib/cryptoService.ts

export async function fetchCryptoData(cryptos: string[]): Promise<any[]> {
    try {
      const key=process.env.COIN_CAP_API_KEY;
      const res = await fetch(
        `https://rest.coincap.io/v3/assets?apiKey=${key}&id=${cryptos.join(",")}`
      );
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch crypto data:", error);
      return [];
    }
  }  