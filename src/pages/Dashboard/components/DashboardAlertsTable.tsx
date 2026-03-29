import moment from "moment";
import { ArrowUpRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AlertStatus, RiskLevel, RecentAlert } from "../dashboard.types";

interface Props {
  alerts: RecentAlert[];
}

// Dark-toned: translucent backgrounds + *-400 text
const severityVariant: Record<
  RiskLevel,
  { label: string; cls: string; accent: string }
> = {
  critical: {
    label: "Critical",
    cls: "bg-red-500/10 text-red-400",
    accent: "border-l-red-500/50",
  },
  high: {
    label: "High",
    cls: "bg-orange-500/10 text-orange-400",
    accent: "border-l-orange-500/50",
  },
  medium: {
    label: "Medium",
    cls: "bg-amber-500/10 text-amber-400",
    accent: "border-l-amber-400/50",
  },
  low: {
    label: "Low",
    cls: "bg-muted/50 text-muted-foreground",
    accent: "border-l-border/40",
  },
};

const statusStyle: Record<AlertStatus, { label: string; cls: string }> = {
  open: { label: "Open", cls: "text-red-400" },
  ack: { label: "Acknowledged", cls: "text-sky-400" },
  resolved: { label: "Resolved", cls: "text-emerald-400" },
};

const DashboardAlertsTable = ({ alerts }: Props) => {
  const openCount = alerts.filter((a) => a.status === "open").length;
  const ackCount = alerts.filter((a) => a.status === "ack").length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;

  return (
    <Card className="gap-0 py-0 border border-border/50 shadow-xs">
      <CardHeader className="gap-0 px-5 pt-5 pb-4">
        <CardTitle className="text-sm">Recent Alerts</CardTitle>
        <CardDescription className="text-xs mt-0.5">
          Latest security and anomaly events
        </CardDescription>
        <CardAction>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground/60">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
                {openCount} open
              </span>
              <span className="text-border/50">·</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400/70" />
                {ackCount} ack
              </span>
              <span className="text-border/50">·</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
                {resolvedCount} resolved
              </span>
            </div>
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

      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-y border-border/30 bg-muted/20">
              {[
                "ID",
                "Time",
                "Severity",
                "Source IP",
                "Service",
                "Message",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-4 h-8"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => {
              const sv = severityVariant[alert.severity] ?? severityVariant.low;
              const st = statusStyle[alert.status] ?? statusStyle.open;
              return (
                <TableRow
                  key={alert.id}
                  className={`border-l-2 ${sv.accent} hover:bg-muted/15 border-border/20 transition-colors`}
                >
                  <TableCell className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground/50">
                    {alert.id}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-xs text-muted-foreground/70 whitespace-nowrap">
                    {moment(alert.timestamp).format("MMM DD, HH:mm")}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <Badge
                      variant="ghost"
                      className={`text-[10px] font-medium rounded-md px-1.5 py-0.5 ${sv.cls}`}
                    >
                      {sv.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2.5 font-mono text-xs text-foreground/80">
                    {alert.source_ip}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <span className="font-mono text-xs text-muted-foreground/70">
                      {alert.service}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-2.5 max-w-sm">
                    <p className="truncate text-xs text-foreground/70">
                      {alert.message}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <span className={`text-[11px] font-medium ${st.cls}`}>
                      {st.label}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DashboardAlertsTable;
