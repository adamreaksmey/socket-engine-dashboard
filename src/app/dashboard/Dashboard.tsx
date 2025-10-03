"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchStats, subscribeToStats } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, MessageSquare, Clock, ArrowLeft, Radio } from "lucide-react";

interface Props {
  environment: string;
}

export default function Dashboard({ environment }: Props) {
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToStats((data) => setStats(data), environment);
    return unsubscribe;
  }, [environment]);

  useEffect(() => {
    fetchStats(environment).then(setStats);
  }, [environment]);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 animate-pulse">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-lg text-slate-600 font-medium">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  WebSocket Monitor
                </h1>
                <Badge variant="secondary" className="text-xs mt-0.5">
                  {environment}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href={`/sessions?environment=${environment}`}>
                  Sessions
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href={`/events?environment=${environment}`}>Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Switch Environment
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Real-Time Dashboard
            </h2>
            <p className="text-slate-600 mt-1">
              Monitor your WebSocket connections and activity
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                Active Connections
              </CardTitle>
              <Activity className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats.totalActiveConnections}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Currently connected clients
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                Total Messages
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats.totalMessages.toLocaleString()}
              </div>
              <p className="text-xs text-slate-600 mt-1">Messages exchanged</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                Last Update
              </CardTitle>
              <Clock className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {new Date(stats.timestamp * 1000).toLocaleTimeString()}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {new Date(stats.timestamp * 1000).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                Last Clean up time
              </CardTitle>
              <Clock className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {new Date(stats.lastStatsCleanup * 1000).toLocaleTimeString()}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {new Date(stats.lastStatsCleanup * 1000).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Endpoints Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Endpoint Statistics</CardTitle>
            <p className="text-sm text-slate-600">
              Detailed metrics for each WebSocket endpoint
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">
                      Endpoint
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">
                      Active
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">
                      Sent
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">
                      Received
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">
                      Avg Size
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.endpoints.map((ep: any, idx: number) => (
                    <tr
                      key={ep.endpoint}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {ep.endpoint}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            ep.activeConnections > 0 ? "default" : "secondary"
                          }
                        >
                          {ep.activeConnections}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {ep.messagesSent.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {ep.messagesReceived.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span className="font-mono text-sm">
                          {ep.avgMessageSize.toFixed(2)} B
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
