import { useState } from "react";
import moment from "moment";
import { Shield, ShieldAlert, ShieldOff, Eye } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/common/TablePagination";
import type {
  SuspiciousIP,
  RiskLevel,
  IPStatus,
  AttackType,
} from "../geoDetection.types";

interface Props {
  data: SuspiciousIP[];
  loading: boolean;
  showCheckbox?: boolean;
}

/* ─── Config ──────────────────────────────────────────────────────────── */
const RISK_STYLE: Record<RiskLevel, { badge: string; dot: string }> = {
  critical: {
    badge: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20",
    dot: "bg-red-500",
  },
  high: {
    badge:
      "bg-orange-500/10 text-orange-500 dark:text-orange-400 border-orange-500/20",
    dot: "bg-orange-500",
  },
  medium: {
    badge:
      "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20",
    dot: "bg-amber-500",
  },
  low: {
    badge: "bg-white/[0.04] text-muted-foreground border-border/60",
    dot: "bg-muted-foreground",
  },
};

const STATUS_CONFIG: Record<
  IPStatus,
  { icon: React.ReactNode; label: string; cls: string }
> = {
  blocked: {
    icon: <ShieldOff className="h-3 w-3" />,
    label: "Blocked",
    cls: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20",
  },
  monitoring: {
    icon: <Eye className="h-3 w-3" />,
    label: "Monitoring",
    cls: "bg-sky-500/10 text-sky-500 dark:text-sky-400 border-sky-500/20",
  },
  whitelisted: {
    icon: <Shield className="h-3 w-3" />,
    label: "Whitelisted",
    cls: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20",
  },
};

const ATTACK_LABEL: Record<AttackType, string> = {
  brute_force: "Brute Force",
  ddos: "DDoS",
  sql_injection: "SQLi",
  port_scan: "Port Scan",
  credential_stuffing: "Cred Stuff",
  anomaly: "Anomaly",
  xss: "XSS",
};

const FLAG: Record<string, string> = {
  RU: "🇷🇺",
  CN: "🇨🇳",
  UA: "🇺🇦",
  NL: "🇳🇱",
  NG: "🇳🇬",
  VN: "🇻🇳",
  US: "🇺🇸",
  FR: "🇫🇷",
  DE: "🇩🇪",
  JP: "🇯🇵",
  SG: "🇸🇬",
};

/* ─── Component ───────────────────────────────────────────────────────── */
const SuspiciousIPTable = ({ data, loading, showCheckbox = true }: Props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const paginated = data.slice((page - 1) * pageSize, page * pageSize);
  const pageIps = paginated.map((d) => d.source_ip);
  const allSelected =
    showCheckbox &&
    pageIps.length > 0 &&
    pageIps.every((ip) => selectedIds.has(ip));
  const someSelected =
    showCheckbox && pageIps.some((ip) => selectedIds.has(ip));

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) pageIps.forEach((ip) => next.delete(ip));
      else pageIps.forEach((ip) => next.add(ip));
      return next;
    });
  };

  const toggleRow = (ip: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(ip)) next.delete(ip);
      else next.add(ip);
      return next;
    });
  };

  const blockedCount = data.filter((d) => d.status === "blocked").length;
  const monitoringCount = data.filter((d) => d.status === "monitoring").length;
  const colCount = showCheckbox ? 9 : 8;

  return (
    <Card className="border-border shadow-none gap-0 py-0">
      <CardHeader className="gap-0 px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-[13px] font-590 flex items-center gap-2 leading-none">
              <ShieldAlert className="h-3.5 w-3.5 text-orange-500 shrink-0" />
              Suspicious IPs
              {showCheckbox && selectedIds.size > 0 && (
                <span className="text-[11px] font-510 font-normal text-muted-foreground">
                  · {selectedIds.size} selected
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-[11px] mt-1 text-muted-foreground/70">
              Top threat actors ranked by attack volume
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-[11px] text-muted-foreground/60">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {blockedCount} blocked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              {monitoringCount} monitoring
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className="px-0 pb-0 flex flex-col"
        style={{ minHeight: `${10 * 36 + 76}px` }}
      >
        {loading ? (
          <div className="px-5 pb-4 space-y-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 rounded-md" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-y border-border/40 bg-background">
                    {showCheckbox && (
                      <TableHead className="px-4 h-8 w-9">
                        <Checkbox
                          checked={
                            allSelected
                              ? true
                              : someSelected
                                ? "indeterminate"
                                : false
                          }
                          onCheckedChange={toggleAll}
                          className="h-3.5 w-3.5"
                        />
                      </TableHead>
                    )}
                    {[
                      "#",
                      "IP Address",
                      "Country",
                      "Attack Type",
                      "Threat",
                      "Attacks",
                      "Last Seen",
                      "Status",
                    ].map((h, i) => (
                      <TableHead
                        key={h}
                        className={`text-[11px] font-510 text-muted-foreground/50 px-4 h-8
                        ${i === 5 ? "text-right" : ""}
                        ${i === 0 ? "w-10" : ""}`}
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
                        No suspicious IPs detected
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((ip) => {
                      const risk = RISK_STYLE[ip.threat_level];
                      const status = STATUS_CONFIG[ip.status];
                      const isSelected =
                        showCheckbox && selectedIds.has(ip.source_ip);
                      return (
                        <TableRow
                          key={ip.source_ip}
                          onClick={() =>
                            showCheckbox && toggleRow(ip.source_ip)
                          }
                          className={`border-border/30 transition-colors
                          ${showCheckbox ? "cursor-pointer" : ""}
                          ${
                            isSelected
                              ? "bg-primary/8 hover:bg-primary/10"
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <TableCell className="px-4 py-2 text-[11px] text-muted-foreground/50 tabular-nums font-mono w-10">
                            {ip.rank}
                          </TableCell>
                          <TableCell className="px-4 py-2 font-mono text-[12px] text-foreground/80 whitespace-nowrap">
                            {ip.source_ip}
                          </TableCell>
                          <TableCell className="px-4 py-2 text-[12px] text-foreground/70 whitespace-nowrap">
                            <span className="flex items-center gap-1.5">
                              <span className="text-[11px]">
                                {FLAG[ip.country_code] ?? "🌐"}
                              </span>
                              {ip.country}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-2 text-[12px] text-muted-foreground/70 whitespace-nowrap">
                            {ATTACK_LABEL[ip.attack_type] ?? ip.attack_type}
                          </TableCell>
                          <TableCell className="px-4 py-2">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-510 capitalize rounded-sm px-1.5 py-0.5 ${risk.badge}`}
                            >
                              <span
                                className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${risk.dot}`}
                              />
                              {ip.threat_level}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-2 text-right">
                            <span className="font-mono text-[12px] font-510 tabular-nums text-foreground/75">
                              {ip.attack_count.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-2 text-[11px] text-muted-foreground/60 whitespace-nowrap tabular-nums">
                            {moment(ip.last_seen).fromNow()}
                          </TableCell>
                          <TableCell className="px-4 py-2">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-510 rounded-sm px-1.5 py-0.5 flex items-center gap-1 w-fit ${status.cls}`}
                            >
                              {status.icon}
                              {status.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <TablePagination
              total={data.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              selectedCount={showCheckbox ? selectedIds.size : 0}
              onClearSelection={() => setSelectedIds(new Set())}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SuspiciousIPTable;
