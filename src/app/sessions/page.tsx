/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { fetchSessions } from "@/lib/api";

export default function Sessions() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchSessions().then(setSessions);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Active Sessions</h1>
      <table className="min-w-full border mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Session ID</th>
            <th className="p-2 border">Remote Address</th>
            <th className="p-2 border">URI</th>
            <th className="p-2 border">Connected At</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.sessionId}>
              <td className="p-2 border">{s.sessionId}</td>
              <td className="p-2 border">{s.remoteAddress}</td>
              <td className="p-2 border">{s.uri}</td>
              <td className="p-2 border">
                {new Date(s.connectedAt).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
