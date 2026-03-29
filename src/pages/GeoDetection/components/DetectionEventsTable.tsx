import { useState } from "react";
import moment from "moment";
import { ChevronDown, ChevronUp, ShieldCheck, ShieldAlert, Eye, X } from "lucide-react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { DetectionEvent, RiskLevel, DetectionAction, AttackType } from "../geoDetection.types";

interface Props {
  data:    DetectionEvent[];
  loading: boolean;
}

/* ─── Config ──────────────────────────────────────────────────────────── */
const SEVERITY_STYLE: Record<RiskLevel, { badge: string; dot: string; row: string }> = {
  critical: { badge: "bg-red-500/8 text-red-600 dark:text-red-400 border-red-500/15",         dot: "bg-red-500",    row: "border-l-red-500/40"    },
  high:     { badge: "bg-orange-500/8 text-orange-600 dark:text-orange-400 border-orange-500/15", dot: "bg-orange-500", row: "border-l-orange-500/40" },
  medium:   { badge: "bg-amber-500/8 text-amber-600 dark:text-amber-400 border-amber-500/15",    dot: "bg-amber-500",  row: "border-l-amber-400/40"  },
  low:      { badge: "bg-secondary text-muted-foreground border-border/40",                      dot: "bg-muted-foreground", row: "border-l-border/30" },
};

const ACTION_CONFIG: Record<DetectionAction, { icon: React.ReactNode; label: string; cls: string }> = {
  blocked:    { icon: <ShieldCheck className="h-3 w-3" />, label: "Blocked",    cls: "bg-red-500/8 text-red-600 dark:text-red-400 border-red-500/15" },
  alerted:    { icon: <ShieldAlert className="h-3 w-3" />, label: "Alerted",    cls: "bg-amber-500/8 text-amber-600 dark:text-amber-400 border-amber-500/15" },
  monitoring: { icon: <Eye className="h-3 w-3" />,         label: "Monitoring", cls: "bg-sky-500/8 text-sky-600 dark:text-sky-400 border-sky-500/15" },
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
  brute_force:         "text-red-600 dark:text-red-400",
  ddos:                "text-orange-600 dark:text-orange-400",
  sql_injection:       "text-purple-600 dark:text-purple-400",
  port_scan:           "text-sky-600 dark:text-sky-400",
  credential_stuffing: "text-rose-600 dark:text-rose-400",
  anomaly:             "text-amber-600 dark:text-amber-400",
  xss:                 "text-violet-600 dark:text-violet-400",
};

const confidenceColor = (c: number) => {
  if (c >= 90) return "text-red-600 dark:text-red-400";
  if (c >= 75) return "text-orange-600 dark:text-orange-400";
  if (c >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-muted-foreground";
};

/* ─── Detail drawer ───────────────────────────────────────────────────── */
const EventDetail = ({ event, onClose }: { event: DetectionEvent; onClose: () => void }) => {
  const sv     = SEVERITY_STYLE[event.severity];
  const action = ACTION_CONFIG[event.action_taken];
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-120 bg-card border-l border-border/40 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 border-b border-border/30">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground font-mono mb-1">{event.id}</p>
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              {ATTACK_LABEL[event.detection_type] ?? event.detection_type}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {moment(event.timestamp).format("MMM DD, YYYY · HH:mm:ss")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 h-7 w-7 rounded-md border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={`text-[11px] rounded-md px-2 py-1 ${sv.badge}`}>
              <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${sv.dot}`} />
              {event.severity}
            </Badge>
            <Badge variant="outline" className={`text-[11px] rounded-md px-2 py-1 flex items-center gap-1 ${action.cls}`}>
              {action.icon}
              {action.label}
            </Badge>
            <Badge variant="outline" className="text-[11px] rounded-md px-2 py-1 bg-secondary text-muted-foreground border-border/40">
              Confidence: <span className={`ml-1 font-semibold ${confidenceColor(event.confidence)}`}>{event.confidence}%</span>
            </Badge>
          </div>

          <div className="rounded-lg bg-muted/30 border border-border/30 px-4 py-3">
            <p className="text-[11px] font-medium text-muted-foreground mb-1.5">Description</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{event.description}</p>
          </div>

          <div className="rounded-lg bg-muted/30 border border-border/30 px-4 py-3 space-y-2.5">
            <p className="text-[11px] font-medium text-muted-foreground">Threat Origin</p>
            {([
              ["Source IP",  <span className="font-mono">{event.source_ip}</span>],
              ["Country",    event.country],
              ["Attack Type", <span className={ATTACK_COLOR[event.detection_type]}>{ATTACK_LABEL[event.detection_type]}</span>],
            ] as [string, React.ReactNode][]).map(([label, val]) => (
              <div key={label} className="flex justify-between gap-4 text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground/85 text-right">{val}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-muted/30 border border-border/30 px-4 py-3 space-y-2.5">
            <p className="text-[11px] font-medium text-muted-foreground">Target</p>
            <div className="flex justify-between gap-4 text-xs">
              <span className="text-muted-foreground">Endpoint</span>
              <span className="font-mono text-foreground/85 text-right truncate max-w-65">{event.target_endpoint}</span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/30 border border-border/30 px-4 py-3">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Detection Confidence</span>
              <span className={`font-semibold tabular-nums ${confidenceColor(event.confidence)}`}>{event.confidence}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border/40 overflow-hidden">
              <div
                className={`h-full rounded-full ${event.confidence >= 90 ? "bg-red-500/60" : event.confidence >= 75 ? "bg-orange-500/60" : event.confidence >= 60 ? "bg-amber-400/60" : "bg-muted-foreground/40"}`}
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
const DetectionEventsTable = ({ data, loading }: Props) => {
  const [selected, setSelected] = useState<DetectionEvent | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const blockedCount = data.filter((d) => d.action_taken === "blocked").length;
  const alertedCount = data.filter((d) => d.action_taken === "alerted").length;

  return (
    <>
      <Card className="border-border/40 shadow-sm gap-0 py-0">
        <CardHeader className="gap-0 px-5 pt-5 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold">Detection Events</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Recent threat detections with confidence scoring
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
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

        <CardContent className="px-0 pb-0">
          {loading ? (
            <div className="px-5 pb-4 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-y border-border/30 bg-muted/30">
                  <TableHead className="text-[11px] font-medium text-muted-foreground px-4 h-9 w-7" />
                  {["Time", "Type", "Severity", "Source IP", "Target", "Confidence", "Action"].map((h, i) => (
                    <TableHead
                      key={h}
                      className={`text-[11px] font-medium text-muted-foreground px-4 h-9 ${i === 5 ? "text-right" : ""}`}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-sm text-muted-foreground">
                      No detection events
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((ev) => {
                    const sv     = SEVERITY_STYLE[ev.severity];
                    const action = ACTION_CONFIG[ev.action_taken];
                    const isOpen = expanded.has(ev.id);
                    return (
                      <>
                        <TableRow
                          key={ev.id}
                          onClick={() => toggleExpand(ev.id)}
                          className={`border-l-2 ${sv.row} border-border/20 cursor-pointer transition-colors hover:bg-muted/30 group`}
                        >
                          <TableCell className="px-3 py-2.5 w-7">
                            <div className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                              {isOpen
                                ? <ChevronUp className="h-3 w-3" />
                                : <ChevronDown className="h-3 w-3" />}
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                            {moment(ev.timestamp).format("HH:mm:ss")}
                          </TableCell>
                          <TableCell className="px-4 py-2.5 whitespace-nowrap">
                            <span className={`text-xs font-medium ${ATTACK_COLOR[ev.detection_type]}`}>
                              {ATTACK_LABEL[ev.detection_type] ?? ev.detection_type}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-medium capitalize rounded-md px-1.5 py-0.5 ${sv.badge}`}
                            >
                              <span className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${sv.dot}`} />
                              {ev.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-2.5 font-mono text-xs text-foreground/70 whitespace-nowrap">
                            {ev.source_ip}
                          </TableCell>
                          <TableCell className="px-4 py-2.5 max-w-45">
                            <span className="font-mono text-xs text-foreground/60 truncate block">
                              {ev.target_endpoint}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-2.5 text-right">
                            <span className={`font-mono text-xs font-medium tabular-nums ${confidenceColor(ev.confidence)}`}>
                              {ev.confidence}%
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-medium rounded-md px-1.5 py-0.5 flex items-center gap-1 w-fit ${action.cls}`}
                            >
                              {action.icon}
                              {action.label}
                            </Badge>
                          </TableCell>
                        </TableRow>

                        {isOpen && (
                          <TableRow key={`${ev.id}-desc`} className="border-border/10 bg-muted/20 hover:bg-muted/20">
                            <TableCell />
                            <TableCell colSpan={7} className="px-4 py-3">
                              <div className="flex items-start justify-between gap-4">
                                <p className="text-xs text-foreground/70 leading-relaxed max-w-2xl">
                                  {ev.description}
                                </p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelected(ev); }}
                                  className="shrink-0 text-[10px] text-muted-foreground hover:text-foreground border border-border shadow-sm rounded-md px-2 py-1 transition-colors whitespace-nowrap"
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
