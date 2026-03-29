import moment from "moment";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedLog } from "../logExplorer.slice";
import type { LogSeverity } from "../logExplorer.types";

/* ─── Severity config ─────────────────────────────────────────────────── */
const SEVERITY_BADGE: Record<LogSeverity, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  error:    "bg-orange-500/10 text-orange-400 border-orange-500/20",
  warning:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
  info:     "bg-sky-500/10 text-sky-400 border-sky-500/20",
  debug:    "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const HTTP_COLOR = (status: number) => {
  if (status >= 500) return "text-red-400";
  if (status >= 400) return "text-orange-400";
  if (status >= 300) return "text-sky-400";
  return "text-emerald-400";
};

/* ─── Small copy button ───────────────────────────────────────────────── */
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-auto p-1 rounded text-muted-foreground/40 hover:text-foreground/80
                 hover:bg-muted/40 transition-colors"
    >
      {copied
        ? <Check className="h-3 w-3 text-emerald-400" />
        : <Copy className="h-3 w-3" />
      }
    </button>
  );
};

/* ─── Section row ─────────────────────────────────────────────────────── */
const Row = ({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) => (
  <div className="flex items-start justify-between gap-3 py-1.5">
    <span className="text-[11px] text-muted-foreground/60 shrink-0 w-28">{label}</span>
    <span className={`text-xs text-right break-all ${mono ? "font-mono text-foreground/80" : "text-foreground/80"}`}>
      {value}
    </span>
  </div>
);

/* ─── Section header ──────────────────────────────────────────────────── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-medium mb-1">
    {children}
  </p>
);

/* ─── Main panel ──────────────────────────────────────────────────────── */
const LogDetailPanel = () => {
  const dispatch = useAppDispatch();
  const log      = useAppSelector((s) => s.logExplorer.selectedLog);

  const isOpen = !!log;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => dispatch(setSelectedLog(null))}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[480px] max-w-full bg-card border-l border-border/40
                    shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {log && (
          <>
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border/30 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className={`text-[10px] capitalize rounded-md px-1.5 py-0.5 ${SEVERITY_BADGE[log.severity]}`}
                  >
                    {log.severity}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground/70">{log.service}</span>
                </div>
                <p className="text-xs text-muted-foreground/60 tabular-nums">
                  {moment(log.timestamp).format("YYYY-MM-DD HH:mm:ss [UTC]")}
                </p>
                <p className="text-xs text-foreground/80 mt-1.5 leading-relaxed">{log.message}</p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => dispatch(setSelectedLog(null))}
                className="text-muted-foreground/40 hover:text-foreground shrink-0 mt-0.5"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {/* Request */}
              <div>
                <SectionTitle>Request</SectionTitle>
                <div className="rounded-lg border border-border/30 bg-background/50 px-3 divide-y divide-border/20">
                  <Row label="Method"        value={<span className="font-mono text-foreground/90">{log.http_method}</span>} />
                  <Row label="Endpoint"      value={log.endpoint} mono />
                  <Row label="HTTP Status"   value={<span className={`font-mono font-semibold ${HTTP_COLOR(log.http_status)}`}>{log.http_status}</span>} />
                  <Row label="Response Time" value={
                    <span className={`font-mono font-semibold ${log.response_time_ms > 2000 ? "text-red-400" : log.response_time_ms > 500 ? "text-amber-400" : "text-emerald-400"}`}>
                      {log.response_time_ms.toLocaleString()} ms
                    </span>
                  } />
                </div>
              </div>

              {/* Origin */}
              <div>
                <SectionTitle>Origin</SectionTitle>
                <div className="rounded-lg border border-border/30 bg-background/50 px-3 divide-y divide-border/20">
                  <Row label="Source IP"  value={log.source_ip} mono />
                  <Row label="Country"    value={log.country} />
                  <Row label="Hostname"   value={log.hostname} mono />
                  <Row label="User Agent" value={
                    <span className="text-muted-foreground/70 text-[11px] break-all">{log.user_agent}</span>
                  } />
                </div>
              </div>

              <Separator className="opacity-30" />

              {/* Raw log */}
              <div>
                <div className="flex items-center mb-1.5">
                  <SectionTitle>Raw Log</SectionTitle>
                  <CopyButton text={log.raw_log} />
                </div>
                <pre className="rounded-lg border border-border/30 bg-zinc-950/60 text-emerald-400/90
                                px-3 py-3 text-[11px] font-mono leading-relaxed whitespace-pre-wrap break-all">
                  {log.raw_log}
                </pre>
              </div>

              {/* Full JSON */}
              <div>
                <div className="flex items-center mb-1.5">
                  <SectionTitle>Full JSON</SectionTitle>
                  <CopyButton text={JSON.stringify(log, null, 2)} />
                </div>
                <pre className="rounded-lg border border-border/30 bg-zinc-950/60 text-sky-300/80
                                px-3 py-3 text-[11px] font-mono leading-relaxed whitespace-pre-wrap break-all
                                max-h-80 overflow-y-auto">
                  {JSON.stringify(log, null, 2)}
                </pre>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default LogDetailPanel;
