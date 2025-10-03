/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { subscribeToEvents } from "@/lib/api";

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToEvents((event) =>
      setEvents((prev) => [event, ...prev].slice(0, 100))
    );
    return unsubscribe;
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Monitoring Events</h1>
      <ul className="mt-4 space-y-2">
        {events.map((e, i) => (
          <li
            key={i}
            className="p-3 border rounded bg-gray-50 shadow text-sm font-mono"
          >
            <strong>{e.type}</strong> @ {e.endpoint || "-"} ({e.sessionId || "N/A"}) →{" "}
            {JSON.stringify(e.data)}
          </li>
        ))}
      </ul>
    </div>
  );
}
