'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCryptoData, setAlert } from '@/app/state/redux/cryptoSlice';
import { RootState } from '@/app/state/redux/store';
import { BellIcon } from '@heroicons/react/24/outline';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface Props {
  money: string;
  historicalData: any[];
}

const coinToSymbol: Record<string, string> = {
  bitcoin: 'btc',
  ethereum: 'eth',
  solana: 'sol',
  binancecoin: 'bnb',
  xrp: 'xrp',
  cardano: 'ada',
  dogecoin: 'doge',
  polygon: 'matic',
  polkadot: 'dot',
  litecoin: 'ltc',
  tron: 'trx',
  avalanche: 'avax',
  shibainu: 'shib',
  chainlink: 'link',
  cosmos: 'atom'
};

export default function CryptoPageClient({ money, historicalData: serverData }: Props) {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.crypto.alert);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newNotification, setNewNotification] = useState(false);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [historicalData, setHistoricalData] = useState<Array<any>>(Array.isArray(serverData) ? serverData : []);
  const priceChangeThreshold = 0.02;
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const handleFavoriteClick = async () => {
    try {
      const res = await fetch(`/api/favmoney/${money}`);
      const data = await res.json();
      if (data.exists) {
        const newCount = data.count + (isFavorite ? -1 : 1);
        await fetch(`/api/favmoney/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ money, count: newCount }),
        });
        setFavoriteCount(newCount);
        setIsFavorite(!isFavorite);
      } else {
        await fetch(`/api/favmoney/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ money, count: 1 }),
        });
        setFavoriteCount(1);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error while updating favorites:", err);
    }
  };

  useEffect(() => {
    const symbol = coinToSymbol[money];
    if (!symbol) return;

    const pair = `${symbol}usdt`;
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${pair}@trade`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      if (!isNaN(price)) {
        setLivePrice(price);
        dispatch(updateCryptoData({ name: money, price }));

        if (prevPrice !== null) {
          const priceDifference = Math.abs(price - prevPrice);
          if (priceDifference >= priceChangeThreshold) {
            dispatch(setAlert({
              type: 'priceAlert',
              message: `The price of ${money} has changed by $${priceDifference.toFixed(2)}! Current Price: $${price.toFixed(2)}`
            }));
            setNewNotification(true);
          }
        }
        setPrevPrice(price);
      }
    };

    return () => ws.close();
  }, [money, prevPrice, dispatch]);

  useEffect(() => {
    if (serverData?.length > 0) return;

    fetch(`/api/coin/${money}/`)
      .then((res) => res.json())
      .then((data) => {
        const hist = Array.isArray(data?.data) ? data.data : [];
        setHistoricalData(hist);
      })
      .catch(() => setHistoricalData([]));
  }, [money, serverData]);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold capitalize">{money} Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* Favorite Button */}
          <button onClick={handleFavoriteClick}
      className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300">
    <span className="text-lg sm:text-xl">
     {isFavorite ? "❤️" : "🤍"}
  </span>
  <span>
    {isFavorite ? "Remove Favorite" : "Add to Favorites"}
  </span>
</button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              className={`relative p-2 rounded-full hover:bg-gray-100 ${newNotification ? 'animate-ping' : ''}`}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setNewNotification(false);
              }}
            >
              <BellIcon className="h-6 w-6 text-gray-700" />
              {newNotification && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg p-3 z-50">
                <h3 className="text-md font-semibold">Notifications</h3>
                {notifications ? (
                  <ul className="mt-2 text-sm">
                    <li className="p-2 border-b">{notifications.message}</li>
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm mt-2">No new notifications</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Price */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Live Price</h2>
        <div className="p-6 rounded shadow bg-white">
          {livePrice !== null ? (
            <p className="text-3xl font-bold text-green-600">${livePrice.toFixed(2)}</p>
          ) : (
            <p className="text-gray-600">Receiving real-time price via WebSocket...</p>
          )}
        </div>
      </section>

      {/* Historical Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Crypto Historical Data</h2>
        {historicalData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Open</th>
                  <th className="px-4 py-2 border">Close</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{new Date(data.TIMESTAMP * 1000).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">${data.OPEN}</td>
                    <td className="px-4 py-2 border">${data.CLOSE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No historical data available</p>
        )}
      </section>

      {/* Chart */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
        <div className="w-full h-64 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData.map(item => ({
              date: new Date(item.TIMESTAMP * 1000).toLocaleDateString(),
              open: item.OPEN,
              close: item.CLOSE,
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="close"
                stroke={prevPrice !== null && livePrice !== null && livePrice < prevPrice ? "#ef4444" : "#10b981"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}