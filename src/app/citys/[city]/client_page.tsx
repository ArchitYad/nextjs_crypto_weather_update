"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addNotification, removeNotification } from "@/app/state/redux/notify/notificationsSlice";
import { RootState } from "@/app/state/redux/store";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Chart = dynamic(() => import("@/app/components/WeatherChart"), { ssr: false });

type Props = {
  city: string;
  forecastData: any[];
  historicalData: any[];
};

export default function CityPageClient({ city, forecastData, historicalData }: Props) {
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [prevWeather, setPrevWeather] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isBellShaking, setIsBellShaking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const handleFavoriteClick = async () => {
    try {
      const res = await fetch(`/api/favcity/${city}`);
      const data = await res.json();

      if (data.exists) {
        const newCount = data.count + (isFavorite ? -1 : 1);
        await fetch(`/api/favcity/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city, count: newCount }),
        });
        setFavoriteCount(newCount);
        setIsFavorite(!isFavorite);
      } else {
        await fetch(`/api/favcity/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city, count: 1 }),
        });
        setFavoriteCount(1);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error while updating favorites:", err);
    }
  };
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications);
 useEffect(() => {
  const addCity = async () => {
    try {
      const res = await fetch(`/api/socket/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Failed to add city:", res.status, text);
      }
    } catch (err) {
      console.error("❌ Error adding city:", err);
    }
  };

  addCity();
}, [city]);
  useEffect(() => {
    const fetchWeather = async (retry = false) => {
      try {
        const res = await fetch(`/api/socket/check?city=${city}`);
        if (!res.ok) {
          const text = await res.text();
          console.warn('Non-200 response:', res.status, text);
          if (res.status === 404 && !retry) {
            console.log(`Retrying fetchWeather for ${city} after delay...`);
            setTimeout(() => fetchWeather(true), 2000); 
          }
          return;
        } 
        const data = await res.json();
        if (currentWeather) setPrevWeather(currentWeather);
        setCurrentWeather(data);
      } catch (err) {
        console.error('Error while fetching weather:', err);
      }
    }; 
    fetchWeather(); 
    const interval = setInterval(() => fetchWeather(), 60 * 60 * 1000); 
  
    return () => clearInterval(interval);
  }, [city]);  
  useEffect(() => {
    if (
      prevWeather &&
      (currentWeather?.temp !== prevWeather?.temp ||
        currentWeather?.conditions !== prevWeather?.conditions)
    ) {
      const message = `Weather changed in ${city}: ${currentWeather.temp}°C, ${currentWeather.conditions}`;
      dispatch(addNotification({ message, type: "info" }));
      setIsBellShaking(true);

      if (notifications.length >= 5) {
        notifications.forEach((n: any) => dispatch(removeNotification(n.id)));
      }

      setTimeout(() => setIsBellShaking(false), 2000);
    }
  }, [currentWeather, prevWeather, city, dispatch]);

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes("clear") || lower.includes("sun")) return "/icons/sunny.png";
    if (lower.includes("rain")) return "/icons/rainy.png";
    if (lower.includes("snow")) return "/icons/snowy.png";
    if (lower.includes("cloud")) return "/icons/cloudy.png";
    return "/icons/weather.png";
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
    {/* Header with city title and buttons */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <h2 className="text-2xl font-bold mb-2 sm:mb-0">Weather in {city}</h2>
      
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={clsx("relative", isBellShaking && "animate-shake")}
          >
            <BellIcon className="w-6 h-6 text-blue-600" />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>
  
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-md p-3 z-50">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No notifications</p>
              ) : (
                notifications.map((note: any) => (
                  <div key={note.id} className="flex justify-between items-center text-sm mb-2">
                    <span>{note.message}</span>
                    <XMarkIcon
                      className="w-4 h-4 text-gray-400 cursor-pointer"
                      onClick={() => dispatch(removeNotification(note.id))}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
  
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
      </div>
    </div>
  
    {/* Current Weather Card */}
    <div className="bg-blue-100 p-4 rounded-xl shadow-md">
      {currentWeather ? (
        <>
          <h3 className="text-xl font-semibold mb-2">Current Weather</h3>
          <p>🌡 Temp: {currentWeather.temp}°C</p>
          <p>🌤 Condition: {currentWeather.conditions}</p>
          {isFavorite && (
            <p className="text-sm text-green-700 mt-2">{city} is in your favorites! Count: {favoriteCount}</p>
          )}
        </>
      ) : (
        <p>Loading current weather...</p>
      )}
    </div>
  
    {/* 7-Day Forecast */}
    <div>
      <h3 className="text-xl font-semibold mb-3">7-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {forecastData.map((day, idx) => (
          <div
            key={idx}
            className="p-4 border rounded-xl bg-white shadow hover:shadow-md transition"
          >
            <p className="font-semibold">{day.datetime}</p>
            <Image
              src={getWeatherIcon(day.conditions)}
              alt={day.conditions}
              width={40}
              height={40}
            />
            <p>{day.conditions}</p>
            <p>{day.tempmax}° / {day.tempmin}°</p>
          </div>
        ))}
      </div>
    </div>
  
    {/* Historical Chart */}
    <div>
      <h3 className="text-xl font-semibold mb-2">30-Day Historical Temperature</h3>
      <div className="bg-white p-4 rounded-xl shadow-md">
        {historicalData.length > 0 ? (
          <Chart data={historicalData} />
        ) : (
          <p>Loading historical chart...</p>
        )}
      </div>
    </div>
  </div>  
  );
}