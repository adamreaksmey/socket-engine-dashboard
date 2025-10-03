/* eslint-disable @typescript-eslint/no-explicit-any */

export function getBaseUrl(env?: string) {
  switch (env) {
    case "dev":
      return process.env.NEXT_PUBLIC_API_BASE_URL_DEV!;
    case "staging":
      return process.env.NEXT_PUBLIC_API_BASE_URL_STAGING!;
    case "uat":
      return process.env.NEXT_PUBLIC_API_BASE_URL_UAT!;
    case "local":
    default:
      return process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL!;
  }
}

export async function fetchStats(env?: string) {
  const res = await fetch(`${getBaseUrl(env)}/api/monitoring/stats`);
  return res.json();
}

export async function fetchSessions(env?: string) {
  const res = await fetch(`${getBaseUrl(env)}/api/monitoring/sessions`);
  return res.json();
}

export function subscribeToEvents(onEvent: (event: any) => void, env?: string) {
  const evtSource = new EventSource(`${getBaseUrl(env)}/api/monitoring/events`);

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

  evtSource.onmessage = (e) => onEvent(JSON.parse(e.data));

  return () => {
    listeners.forEach((remove) => remove());
    evtSource.close();
  };
}

export function subscribeToStats(onStats: (stats: any) => void, env?: string) {
  const evtSource = new EventSource(`${getBaseUrl(env)}/api/monitoring/stats/stream`);
  evtSource.onmessage = (e) => onStats(JSON.parse(e.data));
  return () => evtSource.close();
}
