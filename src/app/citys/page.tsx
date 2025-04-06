'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
export default function CitySearchPage() {
  const [city, setCity] = useState('');
  const [topCities, setTopCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    async function clearCitiesCollection() {
      try {
        const res = await fetch('/api/cities/clear', {
          method: 'DELETE',
        });
        const result = res.status === 204 ? { message: 'No content' } : await res.json();
  
        console.log(result.message);
      } catch (err) {
        console.error('Failed to clear cities collection:', err);
      }
    }
  
    clearCitiesCollection();
  }, []);   
  useEffect(() => {
    async function fetchTopCities() {
      try {
        const response = await fetch('/api/favcity/top-cities');
        const data = await response.json();
        if (data.topCities) {
          setTopCities(data.topCities);
        }
      } catch (error) {
        setError('Error fetching top cities data');
      } finally {
        setLoading(false);
      }
    }

    fetchTopCities();
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      router.push(`/citys/${city.trim().toLowerCase()}`);
    }
  };
  const chartData = topCities.map((city: any) => ({
    name: city.city,
    count: city.count,
  }));

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
    <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Search City Weather</h1>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full p-2 sm:p-3 border border-gray-300 rounded text-base sm:text-lg"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 sm:p-3 rounded hover:bg-blue-700 transition duration-200 ease-in-out"
      >
        View Historical Weather
      </button>
    </form>
  
    {loading ? (
      <p className="mt-4 text-center">Loading top cities...</p>
    ) : error ? (
      <p className="mt-4 text-red-600 text-center">{error}</p>
    ) : topCities.length === 0 ? (
      <p className="mt-4 text-gray-600 text-center">Please add any city to favourite</p>
    ) : (
      <>
        <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-4 text-center">Top 3 Favorite Cities</h2>
        <div className="w-full h-64 sm:h-80 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    )}
  </div>  
  );
}