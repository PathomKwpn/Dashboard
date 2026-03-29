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
import DashboardKPISection from "./components/DashboardKPISection";
import DashboardChartSection from "./components/DashboardChartSection";
import DashboardAlertsTable from "./components/DashboardAlertsTable";
import DashboardTopSourceIPTable from "./components/DashboardTopSourceIPTable";
import DashboardTopServicesTable from "./components/DashboardTopServicesTable";

const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-16 rounded-xl" />
    <Skeleton className="h-72 rounded-xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Skeleton className="lg:col-span-2 h-80 rounded-xl" />
      <Skeleton className="h-80 rounded-xl" />
    </div>
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
      <div className="min-h-full bg-background">
        <div className="border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-56 mt-2" />
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
    <div className="min-h-full bg-background">
      {/* ── Page header ── */}
      <div className="border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Log volume, severity trends, and alert monitoring
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-muted-foreground">Live</span>
            </div>

            <div className="w-px h-5 bg-border" />

            <div className="text-right">
              <p className="text-[10px] font-medium text-muted-foreground">
                Last updated
              </p>
              <p className="text-xs font-medium text-foreground tabular-nums mt-0.5">
                {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        {summary && <DashboardKPISection summary={summary} />}

        <DashboardAlertsTable alerts={recentAlerts} />

        <DashboardChartSection
          timeAxis={timeAxis}
          timeSeries={timeSeries}
          logLevelDistribution={logLevelDistribution}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DashboardTopSourceIPTable data={topSourceIPs} />
          <DashboardTopServicesTable data={topServices} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
