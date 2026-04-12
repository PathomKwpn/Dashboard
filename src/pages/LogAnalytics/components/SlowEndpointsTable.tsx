import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSlowEndpoints } from "../logAnalytics.mock";
import type { SlowEndpoint, HttpMethod } from "../logAnalytics.types";

const METHOD_CLS: Record<HttpMethod, string> = {
  GET:    "text-primary border-primary/30 bg-primary/8",
  POST:   "text-emerald-400 border-emerald-500/30 bg-emerald-500/8",
  PUT:    "text-amber-400 border-amber-500/30 bg-amber-500/8",
  DELETE: "text-red-400 border-red-500/30 bg-red-500/8",
  PATCH:  "text-sky-400 border-sky-500/30 bg-sky-500/8",
};

const msCls = (ms: number) =>
  ms > 1000 ? "text-red-400" : ms > 500 ? "text-amber-400" : ms > 200 ? "text-sky-400" : "text-emerald-400";

const SlowEndpointsTable = () => {
  const [data, setData]       = useState<SlowEndpoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlowEndpoints().then((d) => { setData(d); setLoading(false); });
  }, []);

  return (
    <Card className="border-border shadow-none gap-0 py-0">
      <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
        <div className="flex items-center gap-2">
          <Timer className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <CardTitle className="text-[13px] font-590 leading-none">Slow Endpoints</CardTitle>
        </div>
        <CardDescription className="text-[11px] mt-1 text-muted-foreground/60">
          Ranked by p95 latency — endpoints with highest tail latency
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-2 border-b border-border/30 bg-background">
          {["#", "Endpoint", "Service", "p50 ms", "p95 ms", "p99 ms", "Requests"].map((h) => (
            <span key={h} className="text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="px-5 py-4 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
          </div>
        ) : (
          data.map((row) => (
            <div key={row.rank} className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_1fr] gap-3 items-center px-5 py-3 border-b border-border/20 last:border-0 hover:bg-accent/40 transition-colors">
              <span className="w-5 text-center text-[11px] font-510 tabular-nums text-muted-foreground/30">{row.rank}</span>
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-[9px] font-510 px-1 py-0.5 rounded border font-mono shrink-0 ${METHOD_CLS[row.method]}`}>
                  {row.method}
                </span>
                <span className="font-mono text-[11px] text-foreground/75 truncate">{row.path}</span>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground/60">{row.service.replace("-service", "")}</span>
              <span className={`font-mono text-[12px] font-510 tabular-nums ${msCls(row.p50_ms)}`}>{row.p50_ms}</span>
              <span className={`font-mono text-[12px] font-510 tabular-nums ${msCls(row.p95_ms)}`}>{row.p95_ms}</span>
              <span className={`font-mono text-[12px] font-510 tabular-nums ${msCls(row.p99_ms)}`}>{row.p99_ms}</span>
              <span className="text-[11px] tabular-nums text-muted-foreground/60">
                {row.count >= 1000 ? `${(row.count / 1000).toFixed(0)}k` : row.count.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default SlowEndpointsTable;
