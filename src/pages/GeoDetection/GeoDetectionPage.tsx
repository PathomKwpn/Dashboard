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
import GeoKPISection        from "./components/GeoKPISection";
import GeoMapSection        from "./components/GeoMapSection";
import AttackByCountryChart from "./components/AttackByCountryChart";
import SuspiciousIPTable    from "./components/SuspiciousIPTable";
import DetectionEventsTable from "./components/DetectionEventsTable";

/* ─── Page ───────────────────────────────────────────────────────────── */
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
    if (!summary)                  dispatch(fetchGeoSummary());
    if (attackOrigins.length === 0) dispatch(fetchAttackOrigins());
    if (suspiciousIPs.length === 0) dispatch(fetchSuspiciousIPs());
    if (attacksByCountry.length === 0) dispatch(fetchAttacksByCountry());
    if (detectionEvents.length === 0)  dispatch(fetchDetectionEvents());
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
    <div className="min-h-full">
      {/* ── Page header ── */}
      <div className="border-b border-border/30">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Geo Detection
            </h1>
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              Geographic threat intelligence — real-time attack origin mapping
            </p>
          </div>

          {summary && (
            <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground/60">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
              <span className="w-px h-4 bg-border/40" />
              <span>
                Last updated{" "}
                <span className="text-foreground/70 tabular-nums">
                  {new Date(summary.last_updated).toLocaleTimeString()}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-screen-2xl mx-auto px-6 py-5 space-y-4">
        {/* KPI row */}
        {summary && (
          <GeoKPISection summary={summary} />
        )}
        {summaryLoading && !summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl border border-border/40 bg-card animate-pulse" />
            ))}
          </div>
        )}

        {/* Map + Country chart — side by side on large screens */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3">
            <GeoMapSection data={attackOrigins} loading={originsLoading} />
          </div>
          <div className="xl:col-span-2">
            <AttackByCountryChart data={attacksByCountry} loading={countriesLoading} />
          </div>
        </div>

        {/* Suspicious IPs table */}
        <SuspiciousIPTable data={suspiciousIPs} loading={ipsLoading} />

        {/* Detection events table */}
        <DetectionEventsTable data={detectionEvents} loading={eventsLoading} />
      </div>
    </div>
  );
};

export default GeoDetectionPage;
