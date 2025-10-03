/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/api/monitoring/stats`);
  return res.json();
}

export async function fetchSessions() {
  const res = await fetch(`${BASE_URL}/api/monitoring/sessions`);
  return res.json();
}

export function subscribeToEvents(onEvent: (event: any) => void) {
  const evtSource = new EventSource(`${BASE_URL}/api/monitoring/events`);

  // Listen to all possible event types
  const eventTypes = [
    "MESSAGE_SENT",
    "MESSAGE_RECEIVED",
    "CONNECTION_OPENED",
    "CONNECTION_CLOSED",
    "REDIS_MESSAGE",
  ];

  const listeners: Array<() => void> = [];

  eventTypes.forEach((type) => {
    const listener = (e: MessageEvent) => onEvent(JSON.parse(e.data));
    evtSource.addEventListener(type, listener);
    listeners.push(() => evtSource.removeEventListener(type, listener));
  });

  // Fallback for default messages
  evtSource.onmessage = (e) => onEvent(JSON.parse(e.data));

  return () => {
    listeners.forEach((remove) => remove());
    evtSource.close();
  };
}

export function subscribeToStats(onStats: (stats: any) => void) {
  const evtSource = new EventSource(`${BASE_URL}/api/monitoring/stats/stream`);
  evtSource.onmessage = (e) => onStats(JSON.parse(e.data));
  return () => evtSource.close();
}
