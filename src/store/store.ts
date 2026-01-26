import { configureStore } from "@reduxjs/toolkit";

import dashboardReducer from "@/modules/Dashboard/dashboardSlice";
import eventsReducer from "@/modules/Events/eventsSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    events: eventsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
