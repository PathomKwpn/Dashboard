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

const severityVariant: Record<
  RiskLevel,
  { label: string; cls: string; row: string }
> = {
  critical: {
    label: "Critical",
    cls: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/15 dark:text-red-400 dark:border-red-800/30",
    row: "border-l-2 border-l-red-500",
  },
  high: {
    label: "High",
    cls: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/15 dark:text-orange-400 dark:border-orange-800/30",
    row: "border-l-2 border-l-orange-500",
  },
  medium: {
    label: "Medium",
    cls: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/15 dark:text-yellow-400 dark:border-yellow-800/30",
    row: "border-l-2 border-l-yellow-400",
  },
  low: {
    label: "Low",
    cls: "bg-muted text-muted-foreground border-border",
    row: "border-l-2 border-l-border",
  },
};

const statusStyle: Record<AlertStatus, { label: string; cls: string }> = {
  open: {
    label: "Open",
    cls: "text-red-600 dark:text-red-400",
  },
  ack: {
    label: "Acknowledged",
    cls: "text-sky-600 dark:text-sky-400",
  },
  resolved: {
    label: "Resolved",
    cls: "text-emerald-600 dark:text-emerald-400",
  },
};

const DashboardAlertsTable = ({ alerts }: Props) => {
  return (
    <Card className="gap-0 py-0 border-none">
      <CardHeader className="gap-0 px-5 pt-5 pb-4">
        <CardTitle className="text-sm">Recent Alerts</CardTitle>
        <CardDescription className="text-xs mt-0.5">
          Latest security and anomaly events
        </CardDescription>
        <CardAction>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[11px]">
              {alerts.length} alerts
            </Badge>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground/40 hover:text-foreground"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
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
                  className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 h-9"
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
                <TableRow key={alert.id} className={sv.row}>
                  <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {alert.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                    {moment(alert.timestamp).format("MMM DD, HH:mm")}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-medium rounded-md ${sv.cls}`}
                    >
                      {sv.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-mono text-xs">
                    {alert.source_ip}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium rounded-md"
                    >
                      {alert.service}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 max-w-sm">
                    <p className="truncate text-xs text-foreground/80">
                      {alert.message}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-3">
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
