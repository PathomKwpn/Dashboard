import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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

  return (
    <Card className="gap-0 py-0 hover:border-border transition-all duration-200">
      <CardHeader className="gap-0 px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-muted-foreground tracking-wide">
            {label}
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/60 text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground leading-none">
          {value}
        </p>
        <CardDescription className="flex items-center gap-2 mt-2 text-xs">
          {change !== undefined && !isNeutral && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(change)}%
            </span>
          )}
          {isNeutral && (
            <span className="inline-flex items-center gap-0.5 font-medium text-muted-foreground">
              <Minus className="h-3 w-3" />
              0%
            </span>
          )}
          {description && (
            <span className="text-[11px] text-muted-foreground">
              {description}
            </span>
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default KPICard;
