import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type KPIAccent = "default" | "primary" | "destructive" | "warning" | "success";

const ACCENT_CLASSES: Record<KPIAccent, { bg: string; icon: string }> = {
  default:     { bg: "bg-secondary",        icon: "text-muted-foreground" },
  primary:     { bg: "bg-primary/8",        icon: "text-primary"         },
  destructive: { bg: "bg-red-500/8",        icon: "text-red-500"         },
  warning:     { bg: "bg-amber-500/8",      icon: "text-amber-500"       },
  success:     { bg: "bg-emerald-500/8",    icon: "text-emerald-500"     },
};

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  description?: string;
  accent?: KPIAccent;
}

const KPICard = ({
  label,
  value,
  change,
  icon,
  description,
  accent = "default",
}: KPICardProps) => {
  const isPositive = (change ?? 0) > 0;
  const isNeutral  = change === 0 || change === undefined;
  const ac         = ACCENT_CLASSES[accent];

  return (
    <Card className="gap-0 py-0 border-border/40 hover:border-border/70 shadow-sm hover:shadow-md transition-all duration-200 bg-card">
      <CardContent className="px-5 pt-5 pb-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <p className="text-[11px] font-medium text-muted-foreground tracking-wide">
            {label}
          </p>
          {icon && (
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0
                          [&>svg]:h-4 [&>svg]:w-4 ${ac.bg} ${ac.icon}`}
            >
              {icon}
            </span>
          )}
        </div>

        {/* Value */}
        <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground leading-none">
          {value}
        </p>

        {/* Change + description */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/30">
          {!isNeutral && (
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? "+" : ""}
              {change}%
            </span>
          )}
          {isNeutral && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground/40">
              <Minus className="h-3 w-3" />
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
