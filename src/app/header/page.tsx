"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("🔄 Session Status Updated:", status);
    console.log("📦 Session Data:", session);
  }, [session, status]);

  const handleLogin = async () => {
    try {
      const response = await signIn("google", { redirect: false });
      if (response?.error) {
        console.error("❌ Login failed:", response.error);
      }
    } catch (error) {
      console.error("⚠️ Error during signIn:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error) {
      console.error("⚠️ Error during signOut:", error);
    }
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <header className="p-4 bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-xl font-bold">
          {session?.user?.name || "My App"}
        </h1>

        <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-end">
          {session && (
            <>
              <button
                onClick={() => navigate("/citys")}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
              >
                City Weather
              </button>

              <button
                onClick={() => navigate("/cryptos")}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
              >
                Crypto
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                Dashboard
              </button>
            </>
          )}

          {status === "loading" ? (
            <span>Loading...</span>
          ) : session ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}