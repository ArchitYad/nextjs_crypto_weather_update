"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1e3c72] to-[#2a5298] flex items-center justify-center px-4 py-10">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl max-w-4xl w-full p-8 md:p-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 text-center leading-tight mb-6">
          Welcome to <span className="text-indigo-600">CryptoWeather Nexus</span>
        </h1>

        <p className="text-base md:text-lg text-gray-700 text-center max-w-2xl mx-auto mb-8">
          Your all-in-one dashboard for real-time <strong>cryptocurrency prices</strong>, global <strong>weather updates</strong>, and breaking <strong>news alerts</strong>.
        </p>

        <div className="bg-gradient-to-r from-indigo-100 via-white to-indigo-100 p-6 rounded-2xl shadow-inner">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 text-center">🌟 Key Features</h2>
          <ul className="space-y-4 text-gray-800 text-base md:text-lg px-4">
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 text-xl">💹</span> Live crypto tracking: <strong>Bitcoin</strong>, <strong>Ethereum</strong>, <strong>Solana</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 text-xl">🌍</span> Current weather updates for major cities like <strong>New York</strong>, <strong>London</strong>, and <strong>Tokyo</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 text-xl">📰</span> Breaking news streamed in real-time
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 text-xl">🔔</span> Instant alerts via <strong>WebSocket</strong> for price & weather updates
            </li>
          </ul>
        </div>

        <div className="mt-10 text-center">
          <p className="text-md md:text-lg text-gray-700 mb-6">
            Ready to explore the dashboard? Track your favorite coins and cities in real time.
          </p>
        </div>
      </div>
    </main>
  );
}