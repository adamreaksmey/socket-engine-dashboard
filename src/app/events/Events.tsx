"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToEvents } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, Activity, Zap } from "lucide-react";

interface Props {
  environment: string;
}

export default function Events({ environment }: Props) {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToEvents((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 100));
      setLoading(false);
    }, environment);
    return unsubscribe;
  }, [environment]);

  const filteredEvents = events.filter((e) => {
    const search = filter.toLowerCase();
    return (
      e.type.toLowerCase().includes(search) ||
      (e.endpoint?.toLowerCase().includes(search) ?? false) ||
      (e.sessionId?.toLowerCase().includes(search) ?? false)
    );
  });

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      connect: "bg-green-100 text-green-800 border-green-200",
      disconnect: "bg-red-100 text-red-800 border-red-200",
      message: "bg-blue-100 text-blue-800 border-blue-200",
      error: "bg-orange-100 text-orange-800 border-orange-200",
    };
    const key = type.toLowerCase();
    return colors[key] || "bg-slate-100 text-slate-800 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Event Monitor
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
            <h2 className="text-3xl font-bold text-slate-900">Live Events</h2>
            <p className="text-slate-600 mt-1">
              Real-time monitoring of WebSocket events
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-700">
                {filteredEvents.length} events
              </span>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by type, endpoint, or session ID..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Activity className="w-12 h-12 text-purple-600 animate-pulse" />
                <p className="text-slate-600 font-medium">Loading events...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        <div className="space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2 custom-scrollbar">
          {filteredEvents.map((e, i) => (
            <Card
              key={i}
              className="hover:shadow-lg transition-all border-l-4 border-l-purple-500 animate-in fade-in slide-in-from-top-2"
              style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getEventTypeColor(e.type)}>
                        {e.type}
                      </Badge>
                      {e.endpoint && (
                        <code className="text-sm px-2 py-1 bg-slate-100 rounded font-mono text-slate-700">
                          {e.endpoint}
                        </code>
                      )}
                    </div>
                    {e.sessionId && (
                      <div className="text-xs text-slate-500">
                        Session:{" "}
                        <span className="font-mono">{e.sessionId}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 whitespace-nowrap">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed">
                    {JSON.stringify(e.data, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}

          {!loading && filteredEvents.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <Filter className="w-8 h-8 text-slate-400" />
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium">
                    No events match your filter
                  </p>
                  <p className="text-sm text-slate-500">
                    Try adjusting your search criteria
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
