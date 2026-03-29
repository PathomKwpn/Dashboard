import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type KPIAccent = "default" | "primary" | "destructive" | "warning" | "success";

const ACCENT_CLASSES: Record<KPIAccent, { bg: string; icon: string }> = {
  default:     { bg: "bg-muted/60",          icon: "text-muted-foreground/40" },
  primary:     { bg: "bg-primary/10",         icon: "text-primary"            },
  destructive: { bg: "bg-red-500/10",         icon: "text-red-400"            },
  warning:     { bg: "bg-amber-500/10",       icon: "text-amber-400"          },
  success:     { bg: "bg-emerald-500/10",     icon: "text-emerald-400"        },
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
    <Card className="gap-0 py-0 border border-border/50 hover:border-border/80 shadow-xs hover:shadow-sm transition-all duration-150 bg-card">
      <CardContent className="px-5 pt-4 pb-5">
        {/* Top row: label + icon box */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest leading-none pt-0.5">
            {label}
          </p>
          {icon && (
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-md shrink-0
                          [&>svg]:h-3.5 [&>svg]:w-3.5 ${ac.bg} ${ac.icon}`}
            >
              {icon}
            </span>
          )}
        </div>

        {/* Main value */}
        <p className="text-[1.875rem] font-bold tracking-tight tabular-nums text-foreground leading-none">
          {value}
        </p>

        {/* Change + description */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/30">
          {!isNeutral && (
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
                isPositive
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
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
            <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground/30">
              <Minus className="h-3 w-3" />
              0%
            </span>
          )}
          {description && (
            <span className="text-[11px] text-muted-foreground/40">
              · {description}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
