import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchGeoSummary,
  fetchAttackOrigins,
  fetchSuspiciousIPs,
  fetchAttacksByCountry,
  fetchDetectionEvents,
} from "./geoDetection.thunks";
import { Badge } from "@/components/ui/badge";
import GeoKPISection from "./components/GeoKPISection";
import GeoMapSection from "./components/GeoMapSection";
import AttackByCountryChart from "./components/AttackByCountryChart";
import SuspiciousIPTable from "./components/SuspiciousIPTable";
import DetectionEventsTable from "./components/DetectionEventsTable";

const GeoDetectionPage = () => {
  const dispatch = useAppDispatch();
  const {
    summary,
    attackOrigins,
    suspiciousIPs,
    attacksByCountry,
    detectionEvents,
    summaryLoading,
    originsLoading,
    ipsLoading,
    countriesLoading,
    eventsLoading,
    error,
  } = useAppSelector((s) => s.geoDetection);

  useEffect(() => {
    if (!summary) dispatch(fetchGeoSummary());
    if (attackOrigins.length === 0) dispatch(fetchAttackOrigins());
    if (suspiciousIPs.length === 0) dispatch(fetchSuspiciousIPs());
    if (attacksByCountry.length === 0) dispatch(fetchAttacksByCountry());
    if (detectionEvents.length === 0) dispatch(fetchDetectionEvents());
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

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
              Geo Detection
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Geographic threat intelligence and real-time attack origin mapping
            </p>
          </div>

          {summary && (
            <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-medium">Live</span>
              </span>
              <span className="w-px h-4 bg-border" />
              <span>
                Updated{" "}
                <span className="text-foreground tabular-nums font-medium">
                  {new Date(summary.last_updated).toLocaleTimeString()}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Content — uniform 4px gap grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        {/* Row 1 — KPI cards */}
        {summaryLoading && !summary && (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-lg border border-border/40 bg-card animate-pulse"
              />
            ))}
          </div>
        )}
        {summary && <GeoKPISection summary={summary} />}

        {/* Row 2 — Map (3/5) + Country list (2/5), locked to same height */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 xl:h-130">
          <div className="xl:col-span-3 h-80 xl:h-full flex flex-col">
            <GeoMapSection data={attackOrigins} loading={originsLoading} />
          </div>
          <div className="xl:col-span-2 xl:h-full flex flex-col overflow-hidden">
            <AttackByCountryChart
              data={attacksByCountry}
              loading={countriesLoading}
            />
          </div>
        </div>

        {/* Row 3 — Suspicious IPs */}
        <SuspiciousIPTable
          data={suspiciousIPs}
          loading={ipsLoading}
          showCheckbox={false}
        />

        {/* Row 4 — Detection Events */}
        <DetectionEventsTable
          data={detectionEvents}
          loading={eventsLoading}
          showCheckbox={false}
        />
      </div>
    </div>
  );
};

export default GeoDetectionPage;
