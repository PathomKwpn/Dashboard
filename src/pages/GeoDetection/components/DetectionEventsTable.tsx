import { useState } from "react";
import moment from "moment";
import { ChevronDown, ChevronUp, ShieldCheck, ShieldAlert, Eye, X } from "lucide-react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/common/TablePagination";
import type { DetectionEvent, RiskLevel, DetectionAction, AttackType } from "../geoDetection.types";

interface Props {
  data:          DetectionEvent[];
  loading:       boolean;
  showCheckbox?: boolean;
}

/* ─── Config ──────────────────────────────────────────────────────────── */
const SEVERITY_STYLE: Record<RiskLevel, { badge: string; dot: string; row: string }> = {
  critical: { badge: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20",          dot: "bg-red-500",    row: "border-l-red-500/50"    },
  high:     { badge: "bg-orange-500/10 text-orange-500 dark:text-orange-400 border-orange-500/20", dot: "bg-orange-500", row: "border-l-orange-500/50" },
  medium:   { badge: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20",   dot: "bg-amber-500",  row: "border-l-amber-400/50"  },
  low:      { badge: "bg-white/4 text-muted-foreground border-border/60",                   dot: "bg-muted-foreground", row: "border-l-border/40" },
};

const ACTION_CONFIG: Record<DetectionAction, { icon: React.ReactNode; label: string; cls: string }> = {
  blocked:    { icon: <ShieldCheck className="h-3 w-3" />, label: "Blocked",    cls: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20" },
  alerted:    { icon: <ShieldAlert className="h-3 w-3" />, label: "Alerted",    cls: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20" },
  monitoring: { icon: <Eye className="h-3 w-3" />,         label: "Monitoring", cls: "bg-sky-500/10 text-sky-500 dark:text-sky-400 border-sky-500/20" },
};

const ATTACK_LABEL: Record<AttackType, string> = {
  brute_force:         "Brute Force",
  ddos:                "DDoS",
  sql_injection:       "SQL Injection",
  port_scan:           "Port Scan",
  credential_stuffing: "Cred Stuffing",
  anomaly:             "Anomaly",
  xss:                 "XSS",
};

const ATTACK_COLOR: Record<AttackType, string> = {
  brute_force:         "text-red-500 dark:text-red-400",
  ddos:                "text-orange-500 dark:text-orange-400",
  sql_injection:       "text-purple-500 dark:text-purple-400",
  port_scan:           "text-sky-500 dark:text-sky-400",
  credential_stuffing: "text-rose-500 dark:text-rose-400",
  anomaly:             "text-amber-500 dark:text-amber-400",
  xss:                 "text-violet-500 dark:text-violet-400",
};

const confidenceColor = (c: number) => {
  if (c >= 90) return "text-red-500 dark:text-red-400";
  if (c >= 75) return "text-orange-500 dark:text-orange-400";
  if (c >= 60) return "text-amber-500 dark:text-amber-400";
  return "text-muted-foreground/60";
};

/* ─── Detail drawer ───────────────────────────────────────────────────── */
const EventDetail = ({ event, onClose }: { event: DetectionEvent; onClose: () => void }) => {
  const sv     = SEVERITY_STYLE[event.severity];
  const action = ACTION_CONFIG[event.action_taken];
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-120 bg-card border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4 border-b border-border/40">
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground/60 font-mono mb-1">{event.id}</p>
            <h3 className="text-[13px] font-590 text-foreground leading-tight">
              {ATTACK_LABEL[event.detection_type] ?? event.detection_type}
            </h3>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5 font-510">
              {moment(event.timestamp).format("MMM DD, YYYY · HH:mm:ss")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 h-7 w-7 rounded border border-border/60 bg-white/2 flex items-center
                       justify-center text-muted-foreground hover:text-foreground hover:bg-accent/60
                       transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={`text-[11px] font-510 rounded-sm px-2 py-1 ${sv.badge}`}>
              <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${sv.dot}`} />
              {event.severity}
            </Badge>
            <Badge variant="outline" className={`text-[11px] font-510 rounded-sm px-2 py-1 flex items-center gap-1 ${action.cls}`}>
              {action.icon}
              {action.label}
            </Badge>
            <Badge variant="outline" className="text-[11px] font-510 rounded-sm px-2 py-1 bg-white/4 text-muted-foreground border-border/60">
              Confidence:{" "}
              <span className={`ml-1 font-590 ${confidenceColor(event.confidence)}`}>
                {event.confidence}%
              </span>
            </Badge>
          </div>

          <div className="rounded-lg bg-white/2 border border-border/40 px-4 py-3">
            <p className="text-[11px] font-510 text-muted-foreground/50 mb-1.5">Description</p>
            <p className="text-[13px] text-foreground/75 leading-relaxed">{event.description}</p>
          </div>

          <div className="rounded-lg bg-white/2 border border-border/40 px-4 py-3 space-y-2.5">
            <p className="text-[11px] font-510 text-muted-foreground/50">Threat Origin</p>
            {([
              ["Source IP",   <span className="font-mono">{event.source_ip}</span>],
              ["Country",     event.country],
              ["Attack Type", <span className={ATTACK_COLOR[event.detection_type]}>{ATTACK_LABEL[event.detection_type]}</span>],
            ] as [string, React.ReactNode][]).map(([label, val]) => (
              <div key={label} className="flex justify-between gap-4 text-[12px]">
                <span className="text-muted-foreground/60 font-510">{label}</span>
                <span className="text-foreground/80 text-right">{val}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-white/2 border border-border/40 px-4 py-3">
            <p className="text-[11px] font-510 text-muted-foreground/50 mb-2">Target</p>
            <div className="flex justify-between gap-4 text-[12px]">
              <span className="text-muted-foreground/60 font-510">Endpoint</span>
              <span className="font-mono text-foreground/75 text-right truncate max-w-65">{event.target_endpoint}</span>
            </div>
          </div>

          <div className="rounded-lg bg-white/2 border border-border/40 px-4 py-3">
            <div className="flex justify-between text-[12px] mb-2">
              <span className="text-muted-foreground/60 font-510">Detection Confidence</span>
              <span className={`font-590 tabular-nums ${confidenceColor(event.confidence)}`}>
                {event.confidence}%
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-border/40 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  event.confidence >= 90 ? "bg-red-500/70" :
                  event.confidence >= 75 ? "bg-orange-500/70" :
                  event.confidence >= 60 ? "bg-amber-400/70" : "bg-muted-foreground/40"
                }`}
                style={{ width: `${event.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Main table ──────────────────────────────────────────────────────── */
const DetectionEventsTable = ({ data, loading, showCheckbox = true }: Props) => {
  const [selected, setSelected]       = useState<DetectionEvent | null>(null);
  const [expanded, setExpanded]       = useState<Set<string>>(new Set());
  const [page, setPage]               = useState(1);
  const [pageSize, setPageSize]       = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const paginated    = data.slice((page - 1) * pageSize, page * pageSize);
  const pageIds      = paginated.map((ev) => ev.id);
  const allSelected  = showCheckbox && pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const someSelected = showCheckbox && pageIds.some((id) => selectedIds.has(id));

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) pageIds.forEach((id) => next.delete(id));
      else             pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const blockedCount = data.filter((d) => d.action_taken === "blocked").length;
  const alertedCount = data.filter((d) => d.action_taken === "alerted").length;

  // Base column count (without checkbox): expand + 7 data cols = 8
  const colCount = showCheckbox ? 9 : 8;

  return (
    <>
      <Card className="border-border shadow-none gap-0 py-0">
        <CardHeader className="gap-0 px-5 pt-4 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-[13px] font-590 leading-none">
                Detection Events
                {showCheckbox && selectedIds.size > 0 && (
                  <span className="ml-2 text-[11px] font-510 font-normal text-muted-foreground">
                    · {selectedIds.size} selected
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-[11px] mt-1 text-muted-foreground/70">
                Recent threat detections with confidence scoring
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 shrink-0 text-[11px] text-muted-foreground/60">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                {blockedCount} blocked
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {alertedCount} alerted
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0 flex flex-col" style={{ minHeight: `${10 * 36 + 76}px` }}>
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
                          checked={allSelected ? true : someSelected ? "indeterminate" : false}
                          onCheckedChange={toggleAll}
                          className="h-3.5 w-3.5"
                        />
                      </TableHead>
                    )}
                    {/* Expand chevron column */}
                    <TableHead className="h-8 w-7" />
                    {["Time", "Type", "Severity", "Source IP", "Target", "Confidence", "Action"].map((h, i) => (
                      <TableHead
                        key={h}
                        className={`text-[11px] font-510 text-muted-foreground/50 px-4 h-8 ${i === 5 ? "text-right" : ""}`}
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={colCount} className="text-center py-12 text-[13px] text-muted-foreground/50">
                        No detection events
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((ev) => {
                      const sv         = SEVERITY_STYLE[ev.severity];
                      const action     = ACTION_CONFIG[ev.action_taken];
                      const isOpen     = expanded.has(ev.id);
                      const isSelected = showCheckbox && selectedIds.has(ev.id);
                      return (
                        <>
                          <TableRow
                            key={ev.id}
                            onClick={() => toggleExpand(ev.id)}
                            className={`border-l-2 ${sv.row} border-border/30 cursor-pointer transition-colors group
                              ${isSelected ? "bg-primary/8 hover:bg-primary/10" : "hover:bg-accent/50"}`}
                          >
                            {showCheckbox && (
                              <TableCell
                                className="px-4 py-2 w-9"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleRow(ev.id)}
                                  className="h-3.5 w-3.5"
                                />
                              </TableCell>
                            )}
                            <TableCell className="px-3 py-2 w-7">
                              <div className="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
                                {isOpen
                                  ? <ChevronUp className="h-3 w-3" />
                                  : <ChevronDown className="h-3 w-3" />}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-2 text-[11px] text-muted-foreground/60 whitespace-nowrap tabular-nums font-510">
                              {moment(ev.timestamp).format("HH:mm:ss")}
                            </TableCell>
                            <TableCell className="px-4 py-2 whitespace-nowrap">
                              <span className={`text-[12px] font-510 ${ATTACK_COLOR[ev.detection_type]}`}>
                                {ATTACK_LABEL[ev.detection_type] ?? ev.detection_type}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-510 capitalize rounded-sm px-1.5 py-0.5 ${sv.badge}`}
                              >
                                <span className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${sv.dot}`} />
                                {ev.severity}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-2 font-mono text-[12px] text-foreground/65 whitespace-nowrap">
                              {ev.source_ip}
                            </TableCell>
                            <TableCell className="px-4 py-2 max-w-45">
                              <span className="font-mono text-[11px] text-muted-foreground/50 truncate block">
                                {ev.target_endpoint}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-2 text-right">
                              <span className={`font-mono text-[12px] font-510 tabular-nums ${confidenceColor(ev.confidence)}`}>
                                {ev.confidence}%
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-510 rounded-sm px-1.5 py-0.5 flex items-center gap-1 w-fit ${action.cls}`}
                              >
                                {action.icon}
                                {action.label}
                              </Badge>
                            </TableCell>
                          </TableRow>

                          {isOpen && (
                            <TableRow key={`${ev.id}-desc`} className="border-border/20 bg-background/40 hover:bg-background/40">
                              {showCheckbox && <TableCell />}
                              <TableCell />
                              <TableCell colSpan={7} className="px-4 py-3">
                                <div className="flex items-start justify-between gap-4">
                                  <p className="text-[12px] text-foreground/60 leading-relaxed max-w-2xl">
                                    {ev.description}
                                  </p>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelected(ev); }}
                                    className="shrink-0 text-[11px] font-510 text-muted-foreground/60 hover:text-foreground
                                               border border-border/50 bg-white/2 rounded px-2 py-1
                                               hover:bg-accent/50 transition-colors whitespace-nowrap"
                                  >
                                    Full details
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
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

      {selected && (
        <EventDetail event={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
};

export default DetectionEventsTable;
