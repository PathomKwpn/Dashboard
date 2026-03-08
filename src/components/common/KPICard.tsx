import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  description?: string;
  accent?: string;
  iconBg?: string;
  iconColor?: string;
}

const KPICard = ({ label, value, change, icon, description }: KPICardProps) => {
  const isPositive = (change ?? 0) > 0;
  const isNeutral = change === 0 || change === undefined;

  const iconStyle = isNeutral
    ? "bg-muted/60 text-muted-foreground"
    : isPositive
      ? " text-emerald-600 0 dark:text-emerald-400"
      : " text-red-600  dark:text-red-400";

  return (
    <Card className="gap-0 py-0 hover:shadow-md border-none">
      <CardHeader className="gap-0 px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            {label}
          </CardTitle>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-md ${iconStyle}`}
          >
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <p className="text-2xl font-bold tracking-tight tabular-nums text-foreground leading-none">
          {value}
        </p>
        <div className="flex items-center gap-2 mt-2.5">
          {change !== undefined && !isNeutral && (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                isPositive
                  ? " text-emerald-700  dark:text-emerald-400"
                  : " text-red-700  dark:text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-2.5 w-2.5" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5" />
              )}
              {Math.abs(change)}%
            </span>
          )}
          {isNeutral && (
            <span className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground">
              <Minus className="h-2.5 w-2.5" />
              0%
            </span>
          )}
          {description && (
            <span className="text-[11px] text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
