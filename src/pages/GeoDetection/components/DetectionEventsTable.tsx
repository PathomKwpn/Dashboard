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
  critical: { badge: "bg-red-500/10 text-red-400 border-red-500/20",         dot: "bg-red-500",    row: "border-l-red-500/60"    },
  high:     { badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-500", row: "border-l-orange-500/60" },
  medium:   { badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",    dot: "bg-amber-400",  row: "border-l-amber-400/60"  },
  low:      { badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",    dot: "bg-slate-400",  row: "border-l-border/30"     },
};

const ACTION_CONFIG: Record<DetectionAction, { icon: React.ReactNode; label: string; cls: string }> = {
  blocked:    { icon: <ShieldCheck className="h-3 w-3" />, label: "Blocked",    cls: "bg-red-500/10 text-red-400 border-red-500/20"       },
  alerted:    { icon: <ShieldAlert className="h-3 w-3" />, label: "Alerted",    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  monitoring: { icon: <Eye className="h-3 w-3" />,         label: "Monitoring", cls: "bg-sky-500/10 text-sky-400 border-sky-500/20"       },
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
  brute_force:         "text-red-400",
  ddos:                "text-orange-400",
  sql_injection:       "text-purple-400",
  port_scan:           "text-sky-400",
  credential_stuffing: "text-rose-400",
  anomaly:             "text-amber-400",
  xss:                 "text-violet-400",
};

const confidenceColor = (c: number) => {
  if (c >= 90) return "text-red-400";
  if (c >= 75) return "text-orange-400";
  if (c >= 60) return "text-amber-400";
  return "text-slate-400";
};

/* ─── Detail drawer ───────────────────────────────────────────────────── */
const EventDetail = ({ event, onClose }: { event: DetectionEvent; onClose: () => void }) => {
  const sv     = SEVERITY_STYLE[event.severity];
  const action = ACTION_CONFIG[event.action_taken];
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-[480px] bg-card border-l border-border/40 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-border/30">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground/50 font-mono mb-1">{event.id}</p>
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              {ATTACK_LABEL[event.detection_type] ?? event.detection_type}
            </h3>
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              {moment(event.timestamp).format("MMM DD, YYYY · HH:mm:ss")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 h-7 w-7 rounded-md border border-border/50 shadow-xs flex items-center justify-center text-muted-foreground/50 hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={`text-[11px] rounded-md px-2 py-1 ${sv.badge}`}>
              <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${sv.dot}`} />
              {event.severity}
            </Badge>
            <Badge variant="outline" className={`text-[11px] rounded-md px-2 py-1 flex items-center gap-1 ${action.cls}`}>
              {action.icon}
              {action.label}
            </Badge>
            <Badge variant="outline" className="text-[11px] rounded-md px-2 py-1 bg-muted/30 text-muted-foreground/70 border-border/40">
              Confidence: <span className={`ml-1 font-semibold ${confidenceColor(event.confidence)}`}>{event.confidence}%</span>
            </Badge>
          </div>

          {/* Description */}
          <div className="rounded-lg bg-muted/20 border border-border/30 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground/40 mb-1.5">Description</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{event.description}</p>
          </div>

          {/* Threat Origin */}
          <div className="rounded-lg bg-muted/20 border border-border/30 px-4 py-3 space-y-2.5">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground/40">Threat Origin</p>
            {([
              ["Source IP",  <span className="font-mono">{event.source_ip}</span>],
              ["Country",    event.country],
              ["Attack Type", <span className={ATTACK_COLOR[event.detection_type]}>{ATTACK_LABEL[event.detection_type]}</span>],
            ] as [string, React.ReactNode][]).map(([label, val]) => (
              <div key={label} className="flex justify-between gap-4 text-xs">
                <span className="text-muted-foreground/55">{label}</span>
                <span className="text-foreground/85 text-right">{val}</span>
              </div>
            ))}
          </div>

          {/* Target */}
          <div className="rounded-lg bg-muted/20 border border-border/30 px-4 py-3 space-y-2.5">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground/40">Target</p>
            <div className="flex justify-between gap-4 text-xs">
              <span className="text-muted-foreground/55">Endpoint</span>
              <span className="font-mono text-foreground/85 text-right truncate max-w-[260px]">{event.target_endpoint}</span>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="rounded-lg bg-muted/20 border border-border/30 px-4 py-3">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground/55">Detection Confidence</span>
              <span className={`font-semibold tabular-nums ${confidenceColor(event.confidence)}`}>{event.confidence}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full ${event.confidence >= 90 ? "bg-red-500/70" : event.confidence >= 75 ? "bg-orange-500/70" : event.confidence >= 60 ? "bg-amber-400/70" : "bg-slate-500/70"}`}
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
      <Card className="border border-border/50 shadow-xs gap-0 py-0">
        <CardHeader className="gap-0 px-5 pt-5 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-sm">Detection Events</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Recent threat detections with confidence scoring
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 shrink-0 text-[11px] text-muted-foreground/60">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
                {blockedCount} blocked
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
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
                <TableRow className="hover:bg-transparent border-y border-border/30 bg-muted/20">
                  <TableHead className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-4 h-9 w-7" />
                  {["Time", "Type", "Severity", "Source IP", "Target", "Confidence", "Action"].map((h, i) => (
                    <TableHead
                      key={h}
                      className={`text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-4 h-9 ${i === 5 ? "text-right" : ""}`}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-sm text-muted-foreground/50">
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
                          className={`border-l-2 ${sv.row} border-border/20 cursor-pointer transition-colors hover:bg-muted/20 group`}
                        >
                          <TableCell className="px-3 py-2.5 w-7">
                            <div className="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
                              {isOpen
                                ? <ChevronUp className="h-3 w-3" />
                                : <ChevronDown className="h-3 w-3" />}
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-2.5 text-xs text-muted-foreground/60 whitespace-nowrap tabular-nums">
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
                          <TableCell className="px-4 py-2.5 max-w-[180px]">
                            <span className="font-mono text-xs text-foreground/60 truncate block">
                              {ev.target_endpoint}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-2.5 text-right">
                            <span className={`font-mono text-xs font-semibold tabular-nums ${confidenceColor(ev.confidence)}`}>
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

                        {/* Expanded description row */}
                        {isOpen && (
                          <TableRow key={`${ev.id}-desc`} className="border-border/10 bg-muted/10 hover:bg-muted/10">
                            <TableCell />
                            <TableCell
                              colSpan={7}
                              className="px-4 py-3"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <p className="text-xs text-foreground/70 leading-relaxed max-w-2xl">
                                  {ev.description}
                                </p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelected(ev); }}
                                  className="shrink-0 text-[10px] text-muted-foreground/50 hover:text-foreground/80 border border-border/50 shadow-xs rounded-md px-2 py-1 transition-colors whitespace-nowrap"
                                >
                                  Full details →
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
