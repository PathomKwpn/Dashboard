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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DashboardKPISection from "./components/DashboardKPISection";
import DashboardChartSection from "./components/DashboardChartSection";
import DashboardAlertsTable from "./components/DashboardAlertsTable";
import DashboardTopSourceIPTable from "./components/DashboardTopSourceIPTable";
import DashboardTopServicesTable from "./components/DashboardTopServicesTable";

const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-30 rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Skeleton className="lg:col-span-2 h-85 rounded-xl" />
      <Skeleton className="h-85 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Skeleton className="h-70 rounded-xl" />
      <Skeleton className="h-70 rounded-xl" />
    </div>
    <Skeleton className="h-75 rounded-xl" />
  </div>
);

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
      <div className="min-h-full">
        <div className="border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Badge variant="destructive" className="text-sm px-4 py-2">
          Error: {error}
        </Badge>
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
          <div className="flex items-center gap-3">
            <Separator orientation="vertical" className="h-8" />
            <div className="text-right shrink-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Last updated
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5 tabular-nums">
                {lastUpdated}
              </p>
            </div>
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
