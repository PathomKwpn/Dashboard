import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/store/hooks";
import type { ServiceStatus } from "../logAnalytics.types";

/* ─── Mini sparkline ─────────────────────────────────────────────────────── */
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    chart.setOption({
      grid: { top: 2, bottom: 2, left: 0, right: 0 },
      xAxis: { type: "category", show: false },
      yAxis: { type: "value",    show: false },
      series: [{
        type: "line", data, smooth: true, symbol: "none",
        lineStyle: { color, width: 1.5 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: color + "40" },
          { offset: 1, color: color + "05" },
        ]) },
      }],
      animation: false,
    });
    return () => chart.dispose();
  }, [data, color]);
  return <div ref={ref} style={{ width: "80px", height: "32px" }} />;
};

/* ─── Config ─────────────────────────────────────────────────────────────── */
const STATUS_CFG: Record<ServiceStatus, { cls: string; dot: string; label: string }> = {
  healthy:  { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500", label: "Healthy"  },
  warning:  { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",       dot: "bg-amber-500",   label: "Warning"  },
  critical: { cls: "bg-red-500/10 text-red-400 border-red-500/20",             dot: "bg-red-500",     label: "Critical" },
};

const latCls  = (ms: number) => ms > 200 ? "text-red-400" : ms > 100 ? "text-amber-400" : "text-emerald-400";
const errCls  = (r: number)  => r >= 10  ? "text-red-400" : r >= 5   ? "text-amber-400" : "text-muted-foreground/60";
const uptCls  = (u: number)  => u < 99.9 ? "text-amber-400" : "text-emerald-400";
const sparkColor = (st: ServiceStatus) => st === "critical" ? "#ef4444" : st === "warning" ? "#f59e0b" : "#10b981";

/* ─── Component ──────────────────────────────────────────────────────────── */
const ServicePerformance = () => {
  const { servicePerf: data, servicePerfLoading: loading } = useAppSelector((s) => s.logAnalytics);

  return (
    <Card className="border-border shadow-none gap-0 py-0">
      <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
        <CardTitle className="text-[13px] font-590 leading-none">Service Performance</CardTitle>
        <CardDescription className="text-[11px] mt-1 text-muted-foreground/60">
          Latency, error rate and uptime per service
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto_auto] gap-3 px-5 py-2 border-b border-border/30 bg-background">
          {["Service", "RPS", "Avg ms", "p95 ms", "Error %", "Uptime", "Trend", "Status"].map((h) => (
            <span key={h} className="text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="px-5 py-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
          </div>
        ) : (
          data.map((row) => {
            const st = STATUS_CFG[row.status];
            return (
              <div
                key={row.service}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto_auto] gap-3 items-center px-5 py-3
                           border-b border-border/20 last:border-0 hover:bg-accent/40 transition-colors"
              >
                <span className="font-mono text-[12px] text-foreground/80">{row.service}</span>
                <span className="text-[12px] font-510 tabular-nums text-foreground/70">{row.rps}</span>
                <span className={`font-mono text-[12px] font-510 tabular-nums ${latCls(row.avg_latency)}`}>{row.avg_latency}</span>
                <span className={`font-mono text-[12px] font-510 tabular-nums ${latCls(row.p95_latency)}`}>{row.p95_latency}</span>
                <span className={`font-mono text-[12px] font-510 tabular-nums ${errCls(row.error_rate)}`}>{row.error_rate}%</span>
                <span className={`font-mono text-[12px] font-510 tabular-nums ${uptCls(row.uptime)}`}>{row.uptime}%</span>
                <Sparkline data={row.trend} color={sparkColor(row.status)} />
                <Badge variant="outline" className={`text-[10px] font-510 rounded-sm px-1.5 py-0.5 w-fit ${st.cls}`}>
                  <span className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${st.dot}`} />
                  {st.label}
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ServicePerformance;
