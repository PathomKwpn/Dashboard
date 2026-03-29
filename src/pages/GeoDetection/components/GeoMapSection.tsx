import { ArrowUpRight } from "lucide-react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GeoMapChart } from "@/components/charts";
import { Skeleton } from "@/components/ui/skeleton";
import type { AttackOrigin } from "../geoDetection.types";

interface Props {
  data:    AttackOrigin[];
  loading: boolean;
}

const GeoMapSection = ({ data, loading }: Props) => {
  const totalAttacks = data.reduce((s, d) => s + d.attack_count, 0);
  const totalBlocked = data.reduce((s, d) => s + d.blocked_count, 0);
  const blockRate    = totalAttacks > 0 ? Math.round((totalBlocked / totalAttacks) * 100) : 0;

  return (
    <Card className="border-border/40 shadow-sm gap-0 py-0">
      <CardHeader className="gap-0 px-5 pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Global Threat Intelligence</CardTitle>
            <CardDescription className="text-xs mt-1">
              Real-time geographic distribution of detected threats
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        <CardAction>
          <div className="flex items-center gap-3 text-xs mt-3">
            <span className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/8 border border-emerald-500/15 rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-medium text-emerald-600 dark:text-emerald-400">{blockRate}% Blocked</span>
            </span>
            <span className="flex items-center gap-2 px-2.5 py-1 bg-primary/6 border border-primary/12 rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-medium text-primary tabular-nums">{data.length} Countries</span>
            </span>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="px-4 pt-0 pb-4">
        {loading ? (
          <Skeleton className="w-full rounded-xl" style={{ height: "420px" }} />
        ) : (
          <GeoMapChart data={data} height="420px" />
        )}
      </CardContent>
    </Card>
  );
};

export default GeoMapSection;
