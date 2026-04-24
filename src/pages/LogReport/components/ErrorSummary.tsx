import { TrendingDown, TrendingUp, AlertTriangle, Percent, Server } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BarChart from "@/components/charts/BarChart";
import { useAppSelector } from "@/store/hooks";

/* ─── KPI card ───────────────────────────────────────────────────────────── */
const KPICard = ({
  label, value, sub, icon: Icon, iconCls, trend,
}: {
  label: string; value: string; sub: string;
  icon: React.ElementType; iconCls: string; trend?: number;
}) => (
  <Card className="border-border shadow-none gap-0 py-0">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-510 text-muted-foreground/60">{label}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconCls}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className="text-2xl font-590 text-foreground tracking-tight">{value}</p>
      <div className="flex items-center gap-1.5 mt-1">
        {trend !== undefined && (
          trend < 0
            ? <TrendingDown className="h-3 w-3 text-emerald-400" />
            : <TrendingUp   className="h-3 w-3 text-red-400"     />
        )}
        <span className="text-[11px] text-muted-foreground/60">{sub}</span>
      </div>
    </CardContent>
  </Card>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const ErrorSummary = () => {
  const { errorSummary: data, errorSummaryLoading: loading, error } = useAppSelector((s) => s.logReport);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-2 rounded-lg bg-red-500/8 border border-red-500/20 text-[11px] text-red-400">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          label="Total Errors"
          value={data.total_errors.toLocaleString()}
          sub={`${data.delta_pct > 0 ? "+" : ""}${data.delta_pct}% vs. yesterday`}
          icon={AlertTriangle}
          iconCls="bg-red-500/10 text-red-400"
          trend={data.delta_pct}
        />
        <KPICard
          label="Error Rate"
          value={`${data.error_rate}%`}
          sub="of total log volume"
          icon={Percent}
          iconCls="bg-orange-500/10 text-orange-400"
        />
        <KPICard
          label="Most Affected"
          value={data.top_service}
          sub="highest error volume"
          icon={Server}
          iconCls="bg-amber-500/10 text-amber-400"
        />
      </div>

      <Card className="border-border shadow-none gap-0 py-0">
        <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
          <CardTitle className="text-[13px] font-590 leading-none">Hourly Error Count</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <BarChart
            xAxisData={data.hourly.map((h) => h.hour)}
            seriesData={[{ name: "Errors", data: data.hourly.map((h) => h.count), color: "#ef4444" }]}
            height="200px"
          />
        </CardContent>
      </Card>

      <Card className="border-border shadow-none gap-0 py-0">
        <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
          <CardTitle className="text-[13px] font-590 leading-none">Errors by Service</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 px-5 py-2 border-b border-border/30 bg-background">
            {["Service", "Errors", "Error Rate", "Δ vs Yesterday"].map((h) => (
              <span key={h} className="text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider">{h}</span>
            ))}
          </div>
          {data.by_service.map((row) => (
            <div key={row.service} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 items-center px-5 py-3 border-b border-border/20 last:border-0 hover:bg-accent/40 transition-colors">
              <span className="font-mono text-[12px] text-foreground/80">{row.service}</span>
              <span className="text-[12px] font-510 tabular-nums text-foreground/75">{row.count.toLocaleString()}</span>
              <span className={`text-[12px] font-510 tabular-nums ${row.rate >= 10 ? "text-red-400" : row.rate >= 5 ? "text-amber-400" : "text-muted-foreground/60"}`}>
                {row.rate}%
              </span>
              <span className={`flex items-center gap-1 text-[11px] font-510 tabular-nums ${row.delta <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {row.delta <= 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                {row.delta > 0 ? "+" : ""}{row.delta}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border shadow-none gap-0 py-0">
        <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
          <CardTitle className="text-[13px] font-590 leading-none">Error Type Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="grid grid-cols-[2fr_1fr_1fr_3fr] gap-3 px-5 py-2 border-b border-border/30 bg-background">
            {["Type", "Count", "%", "Sample Message"].map((h) => (
              <span key={h} className="text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider">{h}</span>
            ))}
          </div>
          {data.by_type.map((row) => (
            <div key={row.type} className="grid grid-cols-[2fr_1fr_1fr_3fr] gap-3 items-center px-5 py-3 border-b border-border/20 last:border-0 hover:bg-accent/40 transition-colors">
              <span className="text-[12px] font-510 text-foreground/80">{row.type}</span>
              <span className="text-[12px] tabular-nums text-foreground/70">{row.count.toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full bg-border/40 overflow-hidden">
                  <div className="h-full rounded-full bg-red-500/60" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="text-[11px] tabular-nums text-muted-foreground/60 w-8 text-right">{row.pct}%</span>
              </div>
              <p className="text-[11px] text-muted-foreground/50 truncate font-mono">{row.sample_message}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorSummary;
