import { useEffect, useMemo } from "react";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEventList,
  fetchEventTimeSeries,
  fetchSummary,
  fetchLogLevelDistribution,
  fetchTopSourceIPs,
  fetchTopServices,
  fetchRecentAlerts,
} from "./dashboard.thunks";
import DashboardKPISection from "./components/DashboardKPISection";
import DashboardChartSection from "./components/DashboardChartSection";
import DashboardAlertsTable from "./components/DashboardAlertsTable";
import DashboardTopSourceIPTable from "./components/DashboardTopSourceIPTable";
import DashboardTopServicesTable from "./components/DashboardTopServicesTable";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const {
    summary,
    timeSeries,
    logLevelDistribution,
    topSourceIPs,
    topServices,
    recentAlerts,
    summaryLoading,
    timeSeriesLoading,
    logLevelLoading,
    topSourceIPsLoading,
    topServicesLoading,
    recentAlertsLoading,
    error,
  } = useAppSelector((state) => state.dashboard);

  const isLoading =
    summaryLoading ||
    timeSeriesLoading ||
    logLevelLoading ||
    topSourceIPsLoading ||
    topServicesLoading ||
    recentAlertsLoading;

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchEventTimeSeries());
    dispatch(fetchEventList());
    dispatch(fetchLogLevelDistribution());
    dispatch(fetchTopSourceIPs());
    dispatch(fetchTopServices());
    dispatch(fetchRecentAlerts());
  }, [dispatch]);

  const lastUpdated = useMemo(() => {
    if (!summary?.last_updated) return "-";
    return moment(summary.last_updated).format("YYYY-MM-DD HH:mm");
  }, [summary?.last_updated]);

  const timeAxis = useMemo(
    () => timeSeries.map((item) => moment(item.detect_time).format("HH:mm")),
    [timeSeries],
  );

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

  return (
    <div className="min-h-full">
      {/* Page header */}
      <div className="border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Log volume, severity trends, and alert monitoring
            </p>
          </div>
          <div className="text-right shrink-0 ml-8">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Last updated
            </p>
            <p className="text-sm font-medium text-foreground mt-0.5 tabular-nums">
              {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        {/* 1. KPIs */}
        {summary && <DashboardKPISection summary={summary} />}

        {/* 2 + 3. Charts */}
        <DashboardChartSection
          timeAxis={timeAxis}
          timeSeries={timeSeries}
          logLevelDistribution={logLevelDistribution}
        />

        {/* 4 + 5. Tables side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DashboardTopSourceIPTable data={topSourceIPs} />
          <DashboardTopServicesTable data={topServices} />
        </div>

        {/* 6. Recent Alerts */}
        <DashboardAlertsTable alerts={recentAlerts} />
      </div>
    </div>
  );
};

export default DashboardPage;
