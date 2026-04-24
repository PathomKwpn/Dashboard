import { ArrowUpRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AttackByCountry } from "../geoDetection.types";

interface Props {
  data: AttackByCountry[];
  loading: boolean;
}

/* ── Flag image helper ── */
const FlagImg = ({ code }: { code: string }) => (
  <img
    src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
    srcSet={`https://flagcdn.com/w40/${code.toLowerCase()}.png 2x`}
    width={20}
    height={15}
    alt={code}
    className="rounded-sm shrink-0 object-cover"
    style={{ imageRendering: "crisp-edges" }}
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).style.display = "none";
    }}
  />
);

const AttackByCountryChart = ({ data, loading }: Props) => {
  const top10 = data.slice(0, 10);
  const maxTotal = Math.max(...top10.map((d) => d.total), 1);

  return (
    <Card className="border-border/40 shadow-sm gap-0 py-0 flex flex-col h-full overflow-hidden">
      {/* ── Header ── */}
      <CardHeader className="gap-0 px-5 pt-5 pb-4 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">
              Attacks by Country
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Top origins — blocked vs. passed
            </CardDescription>
          </div>
        </div>

        {/* Legend pills */}
        <CardAction>
          <div className="flex items-center gap-3 text-xs mt-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
              <span className="text-muted-foreground">Blocked</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500/60" />
              <span className="text-muted-foreground">Passed</span>
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground -mt-0.5"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      {/* ── Body ── */}
      <CardContent className="px-3 pb-4 flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div className="space-y-2 px-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-border/30">
            {top10.map((row, i) => {
              const blockRate =
                row.total > 0 ? Math.round((row.blocked / row.total) * 100) : 0;
              const barWidth = (row.total / maxTotal) * 100;
              const blockedPct =
                row.total > 0 ? (row.blocked / row.total) * 100 : 0;
              const passedPct = 100 - blockedPct;

              const rateColor =
                blockRate >= 90
                  ? "text-emerald-500 dark:text-emerald-400"
                  : blockRate >= 70
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-red-500 dark:text-red-400";

              return (
                <li
                  key={row.country_code}
                  className="group flex flex-col gap-1.5 px-2 py-2.5 rounded-lg hover:bg-foreground/3 transition-colors duration-100 cursor-default"
                >
                  {/* Top row — rank, country, total, rate */}
                  <div className="flex items-center gap-2.5">
                    {/* Rank */}
                    <span
                      className="w-4 text-right text-[11px] shrink-0 tabular-nums select-none"
                      style={{ color: "#62666d" }}
                    >
                      {i + 1}
                    </span>

                    {/* Flag + name */}
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <FlagImg code={row.country_code} />
                      <span
                        className="text-[13px] text-foreground truncate"
                        style={{ fontVariationSettings: '"wght" 510' }}
                      >
                        {row.country}
                      </span>
                    </div>

                    {/* Total count */}
                    <span className="text-[12px] tabular-nums text-muted-foreground shrink-0">
                      {row.total.toLocaleString()}
                    </span>

                    {/* Block rate */}
                    <span
                      className={`text-[12px] tabular-nums font-medium w-10 text-right shrink-0 ${rateColor}`}
                    >
                      {blockRate}%
                    </span>
                  </div>

                  {/* Progress bar — proportional width + split blocked/passed */}
                  <div className="flex items-center gap-2.5 pl-6">
                    <div className="flex-1 h-0.75 rounded-full overflow-hidden bg-border/40">
                      {/* Total width scaled to maxTotal */}
                      <div
                        className="h-full flex rounded-full overflow-hidden"
                        style={{ width: `${barWidth}%` }}
                      >
                        <div
                          className="h-full bg-emerald-500/75 dark:bg-emerald-400/65 transition-all"
                          style={{ width: `${blockedPct}%` }}
                        />
                        <div
                          className="h-full bg-red-500/55 dark:bg-red-400/50 transition-all"
                          style={{ width: `${passedPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Passed count (subtle) */}
                    <span
                      className="text-[11px] tabular-nums shrink-0"
                      style={{ color: "#62666d" }}
                    >
                      {row.passed.toLocaleString()} passed
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default AttackByCountryChart;
