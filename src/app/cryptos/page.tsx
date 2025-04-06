'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CryptoSearch() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [topCrypto, setTopCrypto] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchTopCrypto() {
      try {
        const response = await fetch('/api/favmoney/top-money');
        const data = await response.json();
        if (data.topCrypto) {
          setTopCrypto(data.topCrypto);
        }
      } catch (error) {
        setError('Error fetching top cities data');
      } finally {
        setLoading(false);
      }
    }

    fetchTopCrypto();
  }, []);
  const handleSearch = () => {
    if (input.trim()) {
      router.push(`/cryptos/${input.toLowerCase()}`);
    }
  };
  const chartData = topCrypto.map((crypto: any) => ({
    name: crypto.money,
    count: crypto.count,
  }));
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
    {/* Search Bar */}
    <div className="flex flex-col sm:flex-row items-stretch gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search crypto (e.g. bitcoin)"
        className="border border-gray-300 p-2 rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Search
      </button>
    </div>
  
    {/* Content based on state */}
    {loading ? (
      <p className="text-gray-500">Loading top crypto...</p>
    ) : error ? (
      <p className="text-red-600">{error}</p>
    ) : topCrypto.length === 0 ? (
      <p className="text-gray-600">Please add any crypto to favourite</p>
    ) : (
      <>
        <h2 className="text-xl font-semibold">Top 3 Favorite Crypto</h2>
        <div className="bg-white p-4 rounded shadow-md">
          <ResponsiveContainer width="100%" height={300}>
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