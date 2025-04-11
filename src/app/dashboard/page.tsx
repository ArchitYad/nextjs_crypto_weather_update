import { getWeatherData, getCryptoData, getNewsData } from "@/lib/data-fetchers";
import ClientImage from "@/app/components/ClientImage";

type WeatherData = {
  name: string;
  main: { temp: number; humidity: number };
  weather: { description: string }[];
};

type CryptoData = {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  changePercent24Hr: string;
  marketCapUsd: string;
};

type NewsData = {
  title: string;
  pubDate: string;
  image_url?: string;
  link: string;
};

export const revalidate = 3600; 

export default async function DashboardPage() {
  const weather: WeatherData[] = await getWeatherData();
  const crypto: CryptoData[] = await getCryptoData();
  const news: NewsData[] = await getNewsData();

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-10 max-w-screen-xl mx-auto">
    <h1 className="text-3xl font-bold text-center text-gray-800">🌎 Welcome to Your Dashboard</h1>
  
    {/* Weather Section */}
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">🌤 Weather Highlights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {weather.map((w: WeatherData, index: number) =>
          w && w.main && w.weather ? (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-100 to-blue-200 p-5 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-bold text-blue-900 mb-2">{w.name}</h3>
              <p>🌡 <span className="font-medium">Temp:</span> {w.main.temp}°C</p>
              <p>💧 <span className="font-medium">Humidity:</span> {w.main.humidity}%</p>
              <p>🌤 <span className="font-medium">Condition:</span> {w.weather[0].description}</p>
            </div>
          ) : (
            <div key={index} className="bg-red-100 p-4 rounded-xl shadow-md text-red-700">
              <p>❌ Error loading weather data</p>
            </div>
          )
        )}
      </div>
    </section>
  
    {/* Crypto Section */}
    <section className="space-y-6">
  <h2 className="text-2xl font-semibold text-gray-700">💹 Crypto Market Overview</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {crypto.length > 0 ? (
      crypto
        .filter((c: CryptoData) =>
          ['bitcoin', 'ethereum', 'cardano'].includes(c.id.toLowerCase())
        )
        .map((c: CryptoData, index: number) => (
          <div
            key={index}
            className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="text-lg font-bold text-yellow-700 mb-1 capitalize">
              {c.name} ({c.symbol})
            </h3>
            <p>💲 <span className="font-medium">Price:</span> ${parseFloat(c.priceUsd).toFixed(2)}</p>
            <p>📉 <span className="font-medium">24h Change:</span> {parseFloat(c.changePercent24Hr).toFixed(2)}%</p>
            <p>💰 <span className="font-medium">Market Cap:</span> ${Number(c.marketCapUsd).toLocaleString()}</p>
          </div>
        ))
    ) : (
      <div className="col-span-full text-center text-gray-500">No crypto data available.</div>
    )}
  </div>
</section>
  
    {/* News Section */}
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-center text-gray-700">📰 Latest Crypto News</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((n: NewsData, index: number) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{n.title}</h3>
            <p className="text-sm text-gray-500 mb-3">
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(n.pubDate))}
            </p>
            {n.image_url && (
              <ClientImage
                src={n.image_url}
                alt="News"
                className="rounded-lg mb-3 w-full h-40 object-cover"
              />
            )}
            <a
              className="mt-auto inline-block text-indigo-600 hover:text-indigo-800 font-medium transition"
              href={n.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 Read More
            </a>
          </div>
        ))}
      </div>
    </section>
  </div>  
  );
}