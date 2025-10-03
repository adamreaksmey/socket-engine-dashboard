"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSessions } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Globe, Link as LinkIcon, Clock } from "lucide-react";

interface Props {
  environment: string;
}

export default function Sessions({ environment }: Props) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetchSessions(environment).then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, [environment]);

  const formatDuration = (connectedAt: string) => {
    const start = new Date(Number(connectedAt) * 1000).getTime();
    const now = Date.now();
    const diff = now - start;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m`;
    return "Just now";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Session Manager
                </h1>
                <Badge variant="secondary" className="text-xs mt-0.5">
                  {environment}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back Button */}
        <Button
          onClick={() => router.push(`/dashboard?environment=${environment}`)}
          variant="outline"
          className="group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Button>

        {/* Header with Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Active Sessions
            </h2>
            <p className="text-slate-600 mt-1">
              Currently connected WebSocket sessions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-700">
                {sessions.length} active
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Users className="w-12 h-12 text-green-600 animate-pulse" />
                <p className="text-slate-600 font-medium">
                  Loading sessions...
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Sessions Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Connection Details</CardTitle>
                <p className="text-sm text-slate-600">
                  Overview of all active WebSocket connections
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">
                          Session ID
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">
                          Remote Address
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">
                          Endpoint
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">
                          Connected
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((s, idx) => (
                        <tr
                          key={s.sessionId}
                          className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                            idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <code className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                {s.sessionId.slice(0, 12)}...
                              </code>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-700 font-mono text-sm">
                                {s.remoteAddress}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <LinkIcon className="w-4 h-4 text-slate-400" />
                              <code className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded font-mono">
                                {s.uri}
                              </code>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-700 text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span>
                                {new Date(s.connectedAt * 1000).toLocaleTimeString()}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="secondary"
                              className="font-mono text-xs"
                            >
                              {formatDuration(s.connectedAt)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {sessions.length === 0 && (
                    <div className="py-12 text-center space-y-2">
                      <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                          <Users className="w-8 h-8 text-slate-400" />
                        </div>
                      </div>
                      <p className="text-slate-600 font-medium">
                        No active sessions
                      </p>
                      <p className="text-sm text-slate-500">
                        Sessions will appear here when clients connect
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            {sessions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700">
                      Total Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                      {sessions.length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700">
                      Unique Endpoints
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                      {new Set(sessions.map((s) => s.uri)).size}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700">
                      Unique IPs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                      {new Set(sessions.map((s) => s.remoteAddress)).size}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
