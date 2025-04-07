// lib/cryptoService.ts

export async function fetchCryptoData(cryptos: string[]): Promise<any[]> {
    try {
      const res = await fetch(
        `https://api.coincap.io/v2/assets?ids=${cryptos.join(",")}`
      );
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch crypto data:", error);
      return [];
    }
  }  