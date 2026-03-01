import { configureStore } from "@reduxjs/toolkit";

import dashboardReducer from "@/pages/Dashboard/dashboard.slice";
import eventsReducer from "@/pages/Events/events.slice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    events: eventsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
