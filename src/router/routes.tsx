import DashboardPage     from "@/pages/Dashboard/DashboardPage";
import EventsPage        from "@/pages/Events/EventsPage";
import LogExplorerPage   from "@/pages/LogExplorer/LogExplorerPage";
import GeoDetectionPage  from "@/pages/GeoDetection/GeoDetectionPage";

export const routes = [
  { path: "/dashboard",      element: DashboardPage    },
  { path: "/events",         element: EventsPage       },
  { path: "/log-explorer",   element: LogExplorerPage  },
  { path: "/geo-detection",  element: GeoDetectionPage },
];
