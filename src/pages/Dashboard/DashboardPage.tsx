import { useEffect, useMemo } from "react";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEventList,
  fetchEventTimeSeries,
  fetchSummary,
} from "./dashboard.thunks";
import DashboardKPISection from "./components/DashboardKPISection";
import DashboardChartSection from "./components/DashboardChartSection";
import DashboardAlertsTable from "./components/DashboardAlertsTable";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const {
    summary,
    timeSeries,
    events,
    summaryLoading,
    timeSeriesLoading,
    eventsLoading,
    error,
  } = useAppSelector((state) => state.dashboard);

  const isLoading = summaryLoading || timeSeriesLoading || eventsLoading;

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchEventTimeSeries());
    dispatch(fetchEventList());
  }, [dispatch]);

  const lastUpdated = useMemo(() => {
    if (!summary?.last_updated) return "-";
    return moment(summary.last_updated).format("YYYY-MM-DD HH:mm");
  }, [summary?.last_updated]);

  const timeAxis = useMemo(
    () => timeSeries.map((item) => moment(item.detect_time).format("HH:mm")),
    [timeSeries],
  );

  const hasData =
    Boolean(summary) || timeSeries.length > 0 || events.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-destructive">Error: {error}</p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Log Management Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor log volume, severity trends, and suspicious activity.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last updated</p>
          <p className="text-sm font-medium text-foreground mt-1">
            {lastUpdated}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      {summary && <DashboardKPISection summary={summary} />}

      {/* Charts */}
      <DashboardChartSection timeAxis={timeAxis} timeSeries={timeSeries} />

      {/* Alerts Table */}
      <DashboardAlertsTable events={events} />
    </div>
  );
};

export default DashboardPage;
