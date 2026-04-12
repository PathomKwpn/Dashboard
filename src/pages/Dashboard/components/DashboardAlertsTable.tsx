import { useState } from "react";
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
import TablePagination from "@/components/common/TablePagination";
import type { AlertStatus, RiskLevel, RecentAlert } from "../dashboard.types";

interface Props {
  alerts: RecentAlert[];
  showCheckbox?: boolean;
}

const severityVariant: Record<
  RiskLevel,
  { label: string; cls: string; accent: string }
> = {
  critical: {
    label: "Critical",
    cls: "bg-red-500/10 text-red-500 dark:text-red-400",
    accent: "border-l-red-500/50",
  },
  high: {
    label: "High",
    cls: "bg-orange-500/10 text-orange-500 dark:text-orange-400",
    accent: "border-l-orange-500/50",
  },
  medium: {
    label: "Medium",
    cls: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
    accent: "border-l-amber-400/50",
  },
  low: {
    label: "Low",
    cls: "bg-white/4 text-muted-foreground",
    accent: "border-l-border/50",
  },
};

const statusStyle: Record<AlertStatus, { label: string; cls: string }> = {
  open: { label: "Open", cls: "text-red-500 dark:text-red-400" },
  ack: { label: "Acknowledged", cls: "text-sky-500 dark:text-sky-400" },
  resolved: {
    label: "Resolved",
    cls: "text-emerald-500 dark:text-emerald-400",
  },
};

const DashboardAlertsTable = ({ alerts, showCheckbox = true }: Props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const paginated = alerts.slice((page - 1) * pageSize, page * pageSize);

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openCount = alerts.filter((a) => a.status === "open").length;
  const ackCount = alerts.filter((a) => a.status === "ack").length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;
  const colCount = showCheckbox ? 8 : 7;

  return (
    <Card className="gap-0 py-0 border-border shadow-none">
      <CardHeader className="gap-0 px-5 pt-4 pb-3">
        <CardTitle className="text-[13px] font-590 leading-none">
          Recent Alerts
          {showCheckbox && selectedIds.size > 0 && (
            <span className="ml-2 text-[11px] font-510 font-normal text-muted-foreground">
              · {selectedIds.size} selected
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-[11px] mt-1 text-muted-foreground/70">
          Latest security and anomaly events
        </CardDescription>
        <CardAction>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                {openCount} open
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                {ackCount} ack
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {resolvedCount} resolved
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground/60 hover:text-foreground"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent
        className="px-0 pb-0 flex flex-col"
        style={{ minHeight: `${10 * 36 + 76}px` }}
      >
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-y border-border/40 bg-background">
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
                    className="text-[11px] font-510 text-muted-foreground/50 px-4 h-8"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={colCount}
                    className="text-center py-12 text-[13px] text-muted-foreground/50"
                  >
                    No alerts
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((alert) => {
                  const sv =
                    severityVariant[alert.severity] ?? severityVariant.low;
                  const st = statusStyle[alert.status] ?? statusStyle.open;
                  const isSelected = showCheckbox && selectedIds.has(alert.id);
                  return (
                    <TableRow
                      key={alert.id}
                      onClick={() => showCheckbox && toggleRow(alert.id)}
                      className={`border-l-2 ${sv.accent} border-border/30 transition-colors
                      ${showCheckbox ? "cursor-pointer" : ""}
                      ${isSelected ? "bg-primary/8 hover:bg-primary/10" : "hover:bg-accent/50"}`}
                    >
                      <TableCell className="px-4 py-2 font-mono text-[11px] text-muted-foreground/50">
                        {alert.id}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-[11px] text-muted-foreground/60 whitespace-nowrap font-510">
                        {moment(alert.timestamp).format("MMM DD, HH:mm")}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <Badge
                          variant="ghost"
                          className={`text-[10px] font-510 rounded-sm px-1.5 py-0.5 ${sv.cls}`}
                        >
                          {sv.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-2 font-mono text-[12px] text-foreground/75">
                        {alert.source_ip}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <span className="font-mono text-[11px] text-muted-foreground/60">
                          {alert.service}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-2 max-w-sm">
                        <p className="truncate text-[12px] text-foreground/65">
                          {alert.message}
                        </p>
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <span className={`text-[11px] font-510 ${st.cls}`}>
                          {st.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          total={alerts.length}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          selectedCount={showCheckbox ? selectedIds.size : 0}
          onClearSelection={() => setSelectedIds(new Set())}
        />
      </CardContent>
    </Card>
  );
};

export default DashboardAlertsTable;
