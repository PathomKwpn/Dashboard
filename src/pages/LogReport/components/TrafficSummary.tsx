import { useEffect, useState } from "react";
import { Activity, Zap, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LineChart from "@/components/charts/LineChart";
import { fetchTrafficSummary } from "../logReport.mock";
import type { TrafficSummaryData } from "../logReport.types";

const KPICard = ({
  label, value, sub, icon: Icon, iconCls,
}: {
  label: string; value: string; sub: string;
  icon: React.ElementType; iconCls: string;
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
      <p className="text-[11px] text-muted-foreground/60 mt-1">{sub}</p>
    </CardContent>
  </Card>
);

const METHOD_BG: Record<string, string> = {
  GET:    "bg-primary/60",
  POST:   "bg-emerald-500/60",
  PUT:    "bg-amber-500/60",
  DELETE: "bg-red-500/60",
};

const TrafficSummary = () => {
  const [data, setData]       = useState<TrafficSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrafficSummary().then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  const totalByMethod = data.by_method.reduce((s, m) => s + m.count, 0);

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          label="Total Requests"
          value={data.total_requests >= 1_000_000
            ? `${(data.total_requests / 1_000_000).toFixed(2)}M`
            : data.total_requests.toLocaleString()}
          sub="in the last 24 hours"
          icon={Activity}
          iconCls="bg-primary/10 text-primary"
        />
        <KPICard
          label="Average RPS"
          value={`${data.avg_rps.toFixed(2)}`}
          sub="requests per second"
          icon={TrendingUp}
          iconCls="bg-emerald-500/10 text-emerald-400"
        />
        <KPICard
          label="Peak RPS"
          value={`${data.peak_rps}`}
          sub={`at ${data.peak_hour}`}
          icon={Zap}
          iconCls="bg-amber-500/10 text-amber-400"
        />
      </div>

      {/* Traffic over time */}
      <Card className="border-border shadow-none gap-0 py-0">
        <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
          <CardTitle className="text-[13px] font-590 leading-none">Requests Over Time</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <LineChart
            xAxisData={data.hourly.map((h) => h.hour)}
            seriesData={[
              { name: "Total",  data: data.hourly.map((h) => h.total), color: "#7170ff", areaColor: ["rgba(113,112,255,0.12)", "rgba(113,112,255,0.01)"] },
              { name: "GET",    data: data.hourly.map((h) => h.get),   color: "#10b981" },
              { name: "POST",   data: data.hourly.map((h) => h.post),  color: "#f59e0b" },
            ]}
            height="240px"
          />
        </CardContent>
      </Card>

      {/* Method breakdown */}
      <Card className="border-border shadow-none gap-0 py-0">
        <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
          <CardTitle className="text-[13px] font-590 leading-none">Request Method Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-3">
            {data.by_method.map((m) => {
              const pct = Math.round((m.count / totalByMethod) * 100);
              return (
                <div key={m.method} className="flex items-center gap-3">
                  <span className="w-14 text-[11px] font-510 font-mono text-muted-foreground/70">{m.method}</span>
                  <div className="flex-1 h-2 rounded-full bg-border/30 overflow-hidden">
                    <div className={`h-full rounded-full ${METHOD_BG[m.method] ?? "bg-primary/60"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-16 text-right text-[11px] tabular-nums text-foreground/70">
                    {m.count >= 1000 ? `${(m.count / 1000).toFixed(0)}k` : m.count.toLocaleString()}
                  </span>
                  <span className="w-10 text-right text-[11px] tabular-nums text-muted-foreground/50">{pct}%</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficSummary;
