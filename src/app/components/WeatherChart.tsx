"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WeatherChartProps {
  data: { date: string; temperature: number }[];
}

export default function WeatherChart({ data }: WeatherChartProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg my-6 w-full">
      <h3 className="text-xl font-semibold mb-4 text-center">Past 30 Days Temperature</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#e5e5e5" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-30} height={60} />
          <YAxis unit="°C" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}