/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchStats, subscribeToStats } from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const searchParams = useSearchParams();
  const environment = searchParams.get("environment") || "local";

  useEffect(() => {
    const unsubscribe = subscribeToStats((data) => setStats(data), environment);
    return unsubscribe;
  }, [environment]);

  useEffect(() => {
    fetchStats(environment).then(setStats);
  }, [environment])

  if (!stats) return <div className="p-6">Loading stats...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">WebSocket Monitor</h1>
        <div className="space-x-4">
          <Link
            href="/"
            className="px-3 py-1 rounded hover:bg-gray-100 font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/sessions"
            className="px-3 py-1 rounded hover:bg-gray-100 font-medium"
          >
            Sessions
          </Link>
          <Link
            href="/events"
            className="px-3 py-1 rounded hover:bg-gray-100 font-medium"
          >
            Events
          </Link>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Real-Time Dashboard</h2>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white shadow rounded">
            <h3 className="font-semibold">Active Connections</h3>
            <p className="text-xl">{stats.totalActiveConnections}</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <h3 className="font-semibold">Total Messages</h3>
            <p className="text-xl">{stats.totalMessages}</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <h3 className="font-semibold">Last Update</h3>
            <p>{new Date(stats.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Endpoints Table */}
        <div>
          <h3 className="text-xl font-bold mt-6">Endpoints</h3>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full border bg-white shadow rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Endpoint</th>
                  <th className="p-2 border">Active</th>
                  <th className="p-2 border">Sent</th>
                  <th className="p-2 border">Received</th>
                  <th className="p-2 border">Avg Size</th>
                </tr>
              </thead>
              <tbody>
                {stats.endpoints.map((ep: any) => (
                  <tr key={ep.endpoint}>
                    <td className="p-2 border">{ep.endpoint}</td>
                    <td className="p-2 border">{ep.activeConnections}</td>
                    <td className="p-2 border">{ep.messagesSent}</td>
                    <td className="p-2 border">{ep.messagesReceived}</td>
                    <td className="p-2 border">
                      {ep.avgMessageSize.toFixed(2)} B
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
