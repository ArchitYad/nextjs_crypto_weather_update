// lib/newsService.ts

export async function fetchNewsData(): Promise<any[]> {
    const apiKey = process.env.YOUR_NEWSDATA_API_KEY;
  
    if (!apiKey) {
      console.error("Missing News API key");
      return [];
    }
  
    try {
      const res = await fetch(
        `https://newsdata.io/api/1/latest?apikey=${apiKey}&q=cryptocurrency&language=en`
      );
      const data = await res.json();
      return data.results?.slice(0, 5) || [];
    } catch (error) {
      console.error("Failed to fetch news:", error);
      return [];
    }
  }  