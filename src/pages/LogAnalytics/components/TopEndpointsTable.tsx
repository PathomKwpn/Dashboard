import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTopEndpoints } from "../logAnalytics.mock";
import type { TopEndpoint, HttpMethod } from "../logAnalytics.types";

const METHOD_CLS: Record<HttpMethod, string> = {
  GET:    "text-primary border-primary/30 bg-primary/8",
  POST:   "text-emerald-400 border-emerald-500/30 bg-emerald-500/8",
  PUT:    "text-amber-400 border-amber-500/30 bg-amber-500/8",
  DELETE: "text-red-400 border-red-500/30 bg-red-500/8",
  PATCH:  "text-sky-400 border-sky-500/30 bg-sky-500/8",
};

const errorCls = (rate: number) =>
  rate >= 10 ? "text-red-400" : rate >= 5 ? "text-amber-400" : "text-muted-foreground/60";

const msCls = (ms: number) =>
  ms > 500 ? "text-red-400" : ms > 200 ? "text-amber-400" : "text-emerald-400";

const TopEndpointsTable = () => {
  const [data, setData]       = useState<TopEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const maxCount              = Math.max(...data.map((d) => d.count), 1);

  useEffect(() => {
    fetchTopEndpoints().then((d) => { setData(d); setLoading(false); });
  }, []);

  return (
    <Card className="border-border shadow-none gap-0 py-0">
      <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
        <CardTitle className="text-[13px] font-590 leading-none">Top Endpoints</CardTitle>
        <CardDescription className="text-[11px] mt-1 text-muted-foreground/60">
          Ranked by request volume — top 10
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-2 border-b border-border/30 bg-background">
          {["#", "Endpoint", "Service", "Avg ms", "p95 ms", "Error %"].map((h) => (
            <span key={h} className="text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="px-5 py-4 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
          </div>
        ) : (
          data.map((row) => {
            const pct = Math.round((row.count / maxCount) * 100);
            return (
              <div key={row.rank} className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr] gap-3 items-center px-5 py-3 border-b border-border/20 last:border-0 hover:bg-accent/40 transition-colors">
                <span className="w-5 text-center text-[11px] font-510 tabular-nums text-muted-foreground/30">{row.rank}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[9px] font-510 px-1 py-0.5 rounded border font-mono shrink-0 ${METHOD_CLS[row.method]}`}>
                      {row.method}
                    </span>
                    <span className="font-mono text-[11px] text-foreground/75 truncate">{row.path}</span>
                  </div>
                  <div className="h-px w-full rounded-full bg-border/30 overflow-hidden">
                    <div className="h-full rounded-full bg-primary/30" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground/40 tabular-nums mt-0.5">
                    {row.count.toLocaleString()} reqs
                  </span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground/60">{row.service.replace("-service", "")}</span>
                <span className={`font-mono text-[12px] font-510 tabular-nums ${msCls(row.avg_ms)}`}>{row.avg_ms}</span>
                <span className={`font-mono text-[12px] font-510 tabular-nums ${msCls(row.p95_ms)}`}>{row.p95_ms}</span>
                <span className={`font-mono text-[12px] font-510 tabular-nums ${errorCls(row.error_rate)}`}>{row.error_rate}%</span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default TopEndpointsTable;
