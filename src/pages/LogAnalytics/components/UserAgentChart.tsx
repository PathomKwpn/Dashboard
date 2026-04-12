import { useEffect, useState } from "react";
import { Monitor, Smartphone, Bot, Terminal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PieChart from "@/components/charts/PieChart";
import { fetchUserAgents } from "../logAnalytics.mock";
import type { UserAgentRow, AgentType } from "../logAnalytics.types";

const TYPE_CFG: Record<AgentType, { label: string; icon: React.ElementType; cls: string }> = {
  browser: { label: "Browser", icon: Monitor,    cls: "text-primary bg-primary/10"         },
  mobile:  { label: "Mobile",  icon: Smartphone, cls: "text-amber-400 bg-amber-500/10"      },
  bot:     { label: "Bot",     icon: Bot,        cls: "text-sky-400 bg-sky-500/10"          },
  api:     { label: "API",     icon: Terminal,   cls: "text-emerald-400 bg-emerald-500/10"  },
};

const UserAgentChart = () => {
  const [data, setData]       = useState<UserAgentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAgents().then((d) => { setData(d); setLoading(false); });
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

  /* Type summary */
  const typeSummary = (["browser", "mobile", "bot", "api"] as AgentType[]).map((t) => ({
    type: t,
    count: data.filter((d) => d.type === t).reduce((s, d) => s + d.count, 0),
    pct:   data.filter((d) => d.type === t).reduce((s, d) => s + d.pct, 0),
  }));

  return (
    <div className="space-y-4">
      {/* Type summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {typeSummary.map(({ type, count, pct }) => {
          const cfg = TYPE_CFG[type];
          const Icon = cfg.icon;
          return (
            <Card key={type} className="border-border shadow-none gap-0 py-0">
              <CardContent className="p-4">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg mb-3 ${cfg.cls}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <p className="text-xl font-590 tracking-tight text-foreground">{pct.toFixed(1)}%</p>
                <p className="text-[11px] font-510 text-muted-foreground/60 mt-0.5">{cfg.label}</p>
                <p className="text-[10px] text-muted-foreground/40 tabular-nums mt-0.5">{count.toLocaleString()} reqs</p>
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
              data={data.slice(0, 6).map((d) => ({ name: d.agent, value: d.count, itemStyle: { color: d.color } }))}
              centerLabel="Agents"
              height="220px"
            />
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border shadow-none gap-0 py-0">
          <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
            <CardTitle className="text-[13px] font-590 leading-none">Top Agents</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {data.map((row) => {
              const cfg  = TYPE_CFG[row.type];
              const Icon = cfg.icon;
              return (
                <div key={row.rank} className="flex items-center gap-3 px-5 py-3 border-b border-border/20 last:border-0 hover:bg-accent/40 transition-colors">
                  <span className="w-5 shrink-0 text-center text-[11px] tabular-nums font-510 text-muted-foreground/30">{row.rank}</span>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-md shrink-0 ${cfg.cls}`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] text-foreground/80 truncate">{row.agent}</span>
                    </div>
                    <div className="h-px w-full rounded-full bg-border/30 overflow-hidden">
                      <div className="h-full rounded-full bg-primary/30" style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                  <span className="text-[11px] tabular-nums text-muted-foreground/60 shrink-0">{row.pct}%</span>
                  <span className="text-[11px] tabular-nums text-foreground/60 shrink-0 w-16 text-right">
                    {row.count >= 1000 ? `${(row.count / 1000).toFixed(0)}k` : row.count}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAgentChart;
