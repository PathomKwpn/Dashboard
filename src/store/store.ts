import { configureStore } from "@reduxjs/toolkit";

import dashboardReducer    from "@/pages/Dashboard/dashboard.slice";
import authReducer         from "@/pages/Auth/auth.slice";
import logExplorerReducer  from "@/pages/LogExplorer/logExplorer.slice";
import geoDetectionReducer from "@/pages/GeoDetection/geoDetection.slice";
import logReportReducer    from "@/pages/LogReport/logReport.slice";
import logAnalyticsReducer from "@/pages/LogAnalytics/logAnalytics.slice";

export const store = configureStore({
  reducer: {
    auth:         authReducer,
    dashboard:    dashboardReducer,
    logExplorer:  logExplorerReducer,
    geoDetection: geoDetectionReducer,
    logReport:    logReportReducer,
    logAnalytics: logAnalyticsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
