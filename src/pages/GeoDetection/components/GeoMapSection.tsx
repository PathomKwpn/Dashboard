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
    <Card className="border border-border/50 shadow-xs gap-0 py-0">
      <CardHeader className="gap-0 px-5 pt-5 pb-0">
        <CardTitle className="text-sm">Attack Origin Map</CardTitle>
        <CardDescription className="text-xs mt-0.5">
          Geographic distribution of detected threats — dot size = volume
        </CardDescription>
        <CardAction>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {blockRate}% blocked
            </span>
            <span className="tabular-nums">{data.length} countries</span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground/30 hover:text-foreground"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="px-4 pt-3 pb-4">
        {loading ? (
          <Skeleton className="w-full rounded-xl" style={{ height: "400px" }} />
        ) : (
          <GeoMapChart data={data} height="400px" />
        )}
      </CardContent>
    </Card>
  );
};

export default GeoMapSection;
