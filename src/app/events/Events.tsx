
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToEvents } from "@/lib/api";

interface Props {
    environment: string;
}

export default function Events({ environment }: Props) {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToEvents(
      (event) => {
        setEvents((prev) => [event, ...prev].slice(0, 100));
        setLoading(false);
      },
      environment
    );
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

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/dashboard?environment=${environment}`)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        &larr; Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold">Monitoring Events ({environment})</h1>

      {/* Filter Input */}
      <input
        type="text"
        placeholder="Filter by type, endpoint, or sessionId..."
        className="mt-4 p-2 border rounded w-full"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-4 text-gray-500 font-medium">Loading events...</div>
      )}

      <ul className="mt-4 space-y-4 max-h-[70vh] overflow-auto">
        {filteredEvents.map((e, i) => (
          <li
            key={i}
            className="p-3 border rounded bg-gray-50 shadow text-sm font-mono"
          >
            <div className="mb-1">
              <strong className="text-blue-600">{e.type}</strong> @{" "}
              <span className="text-gray-700">{e.endpoint || "-"}</span> (
              {e.sessionId || "N/A"})
            </div>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
              {JSON.stringify(e.data, null, 2)}
            </pre>
          </li>
        ))}
        {!loading && filteredEvents.length === 0 && (
          <li className="text-gray-500 p-2">No events match your filter.</li>
        )}
      </ul>
    </div>
  );
}