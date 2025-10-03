/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchSessions } from "@/lib/api";

export default function Sessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const environment = searchParams.get("environment") || "local";

  useEffect(() => {
    fetchSessions(environment).then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, [environment]);

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/dashboard?environment=${environment}`)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        &larr; Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold">Active Sessions</h1>

      {loading ? (
        <div className="mt-4 text-gray-500 font-medium">
          Loading sessions...
        </div>
      ) : (
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
            {sessions.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-2 text-gray-500">
                  No active sessions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
