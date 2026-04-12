import type { Notification } from "./notification.types";

/* ─── Mock dataset ───────────────────────────────────────────────────────── */
const BASE_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Critical threat detected",
    description: "192.168.4.22 triggered brute-force rule — 847 attempts in 60 s.",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "2",
    type: "alert",
    title: "DDoS pattern identified",
    description: "Spike of 12.4k req/s from AS45899 (VN). Auto-block applied.",
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "High error rate on auth-service",
    description: "Error rate reached 14.2 % — above the 10 % threshold.",
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "4",
    type: "warning",
    title: "Disk usage at 87 %",
    description: "Log storage node log-01 is approaching capacity limit.",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "5",
    type: "info",
    title: "Geo Detection model updated",
    description: "Threat model v2.4.1 deployed — improved CN/RU accuracy +12 %.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "6",
    type: "info",
    title: "Scheduled maintenance tonight",
    description: "API gateway restart at 02:00 UTC. Expected downtime < 30 s.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "7",
    type: "success",
    title: "Firewall rules synced",
    description: "47 new block rules pushed to all edge nodes successfully.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "8",
    type: "success",
    title: "Weekly report generated",
    description: "Security summary for Apr 7–13 is ready for download.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

/* ─── Simulated API fetch (600 ms latency) ───────────────────────────────── */
export const fetchNotifications = (): Promise<Notification[]> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(structuredClone(BASE_NOTIFICATIONS)), 600),
  );
