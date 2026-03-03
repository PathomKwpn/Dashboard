import { configureStore } from "@reduxjs/toolkit";

import dashboardReducer from "@/pages/Dashboard/dashboard.slice";
import eventsReducer from "@/pages/Events/events.slice";
import authReducer from "@/pages/Auth/auth.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    events: eventsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
