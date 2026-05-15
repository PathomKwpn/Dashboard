import { lazy } from "react";

const DashboardPage = lazy(() => import("@/pages/Dashboard/DashboardPage"));
const LogExplorerPage = lazy(() => import("@/pages/LogExplorer/LogExplorerPage"));
const GeoDetectionPage = lazy(() => import("@/pages/GeoDetection/GeoDetectionPage"));
const LogReportPage = lazy(() => import("@/pages/LogReport/LogReportPage"));
const LogAnalyticsPage = lazy(() => import("@/pages/LogAnalytics/LogAnalyticsPage"));
const SettingsPage = lazy(() => import("@/pages/Settings/SettingsPage"));

export const routes = [
  { path: "/dashboard", component: DashboardPage },
  { path: "/log-explorer", component: LogExplorerPage },
  { path: "/geo-detection", component: GeoDetectionPage },
  { path: "/log-report", component: LogReportPage },
  { path: "/log-analytics", component: LogAnalyticsPage },
  { path: "/settings", component: SettingsPage },
];
