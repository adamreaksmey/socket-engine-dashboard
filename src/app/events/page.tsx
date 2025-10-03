/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { subscribeToEvents } from "@/lib/api";

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToEvents((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 100));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Monitoring Events</h1>
      <ul className="mt-4 space-y-4 max-h-[80vh] overflow-auto">
        {events.map((e, i) => (
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
      </ul>
    </div>
  );
}
