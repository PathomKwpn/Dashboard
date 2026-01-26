import DashboardPage from "@/modules/Dashboard"
import EventsPage from "@/modules/Events"

export const routes = [
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/events",
    element: <EventsPage />,
  },
]
