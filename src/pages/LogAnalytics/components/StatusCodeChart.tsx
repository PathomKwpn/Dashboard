import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PieChart from "@/components/charts/PieChart";
import BarChart from "@/components/charts/BarChart";
import { fetchStatusCodes } from "../logAnalytics.mock";
import type { StatusCodeData } from "../logAnalytics.types";

const StatusCodeChart = () => {
  const [data, setData]       = useState<StatusCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatusCodes().then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {data.groups.map((g) => {
          const pct = Math.round((g.value / data.total) * 100);
          return (
            <Card key={g.name} className="border-border shadow-none gap-0 py-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: g.color }} />
                  <span className="text-[11px] font-510 text-muted-foreground/60">{g.name}</span>
                </div>
                <p className="text-xl font-590 text-foreground tracking-tight">{pct}%</p>
                <p className="text-[10px] text-muted-foreground/50 mt-0.5 tabular-nums">
                  {g.value.toLocaleString()} reqs
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border shadow-none gap-0 py-0">
          <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
            <CardTitle className="text-[13px] font-590 leading-none">Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <PieChart
              data={data.groups.map((g) => ({ name: `${g.name} ${g.label}`, value: g.value, itemStyle: { color: g.color } }))}
              centerLabel="Requests"
              height="220px"
            />
          </CardContent>
        </Card>

        <Card className="border-border shadow-none gap-0 py-0">
          <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
            <CardTitle className="text-[13px] font-590 leading-none">Detail</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {data.groups.map((g) => {
              const pct = Math.round((g.value / data.total) * 100);
              return (
                <div key={g.name} className="flex items-center gap-3 px-5 py-3 border-b border-border/20 last:border-0">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                  <span className="w-8 text-[11px] font-510 font-mono text-foreground/80">{g.name}</span>
                  <span className="flex-1 text-[11px] text-muted-foreground/60">{g.label}</span>
                  <div className="w-20 h-1 rounded-full bg-border/30 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: g.color + "99" }} />
                  </div>
                  <span className="w-16 text-right text-[11px] tabular-nums text-foreground/70">
                    {g.value >= 1000 ? `${(g.value / 1000).toFixed(0)}k` : g.value}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* By service */}
      <Card className="border-border shadow-none gap-0 py-0">
        <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
          <CardTitle className="text-[13px] font-590 leading-none">Status Codes by Service</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <BarChart
            xAxisData={data.by_service.map((s) => s.service.replace("-service", ""))}
            seriesData={[
              { name: "2xx", data: data.by_service.map((s) => s["2xx"]), color: "#10b981" },
              { name: "3xx", data: data.by_service.map((s) => s["3xx"]), color: "#38bdf8" },
              { name: "4xx", data: data.by_service.map((s) => s["4xx"]), color: "#f59e0b" },
              { name: "5xx", data: data.by_service.map((s) => s["5xx"]), color: "#ef4444" },
            ]}
            height="220px"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusCodeChart;
