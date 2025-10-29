"use client";

import { useEffect, useState } from "react";
import { getLatestData, getHistory } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SensorData {
  waterLevel: number;
  rainfall: number;
  temperature: number;
  timestamp: string;
}

export default function Dashboard() {
  const [data, setData] = useState<SensorData[]>([]);
  const [latest, setLatest] = useState<SensorData | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      const hist = await getHistory(50, 1);
      if (hist?.data) {
        setData(hist.data as SensorData[]);
        setLatest(hist.data[hist.data.length - 1] ?? null);
      } else {
        const res = await getLatestData();
        if (res) {
          setLatest(res);
          setData([res]);
        }
      }
    };

    fetchInitial();
    const interval = setInterval(async () => {
      const res = await getLatestData();
      if (res) {
        setLatest(res);
        setData((prev) => [...prev.slice(-49), res]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-cyan-400">
        SmartFlood Dashboard
      </h1>

      {latest ? (
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 p-4 rounded-xl shadow">
            <h2 className="text-lg">Water Level</h2>
            <p
              className={`text-3xl font-bold ${
                latest.waterLevel > 80 ? "text-red-500" : "text-green-400"
              }`}
            >
              {latest.waterLevel.toFixed(2)} cm
            </p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl shadow">
            <h2 className="text-lg">Rainfall</h2>
            <p className="text-3xl font-bold text-blue-400">
              {latest.rainfall.toFixed(2)} mm
            </p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl shadow">
            <h2 className="text-lg">Temperature</h2>
            <p className="text-3xl font-bold text-yellow-400">
              {latest.temperature.toFixed(1)} °C
            </p>
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}

      <div className="bg-slate-900 p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-300">
          Water Level History
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(t) => t.split("T")[1].split(".")[0]}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="waterLevel"
              stroke="#0ff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
