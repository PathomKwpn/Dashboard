import { useState } from "react";
import { Download, FileText, FileSpreadsheet, FileCode, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { prependReport } from "../logReport.slice";
import { triggerExport } from "@/services/logReport.service";
import type { ExportConfig, ReportFormat, Report } from "../logReport.types";

/* ─── Constants ──────────────────────────────────────────────────────────── */
const AVAILABLE_SERVICES = ["auth-service", "api-gateway", "user-service", "payment-service", "notification-service"];

const FORMATS: { value: ReportFormat; label: string; desc: string; icon: React.ElementType }[] = [
  { value: "CSV",    label: "CSV",    desc: "Spreadsheet-compatible",       icon: FileSpreadsheet },
  { value: "JSON",   label: "JSON",   desc: "Structured, single file",      icon: FileCode        },
  { value: "NDJSON", label: "NDJSON", desc: "Newline-delimited, streaming", icon: FileCode        },
  { value: "PDF",    label: "PDF",    desc: "Formatted HTML report",        icon: FileText        },
];

const SEVERITIES = ["critical", "error", "warning", "info", "debug"];

const today   = new Date().toISOString().slice(0, 10);
const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10);

const defaultConfig: ExportConfig = {
  format:     "CSV",
  date_from:  weekAgo,
  date_to:    today,
  services:   [],
  severities: [],
  max_rows:   10_000,
};

/* ─── File generation ────────────────────────────────────────────────────── */
function buildExportContent(cfg: ExportConfig): { content: string; mime: string; ext: string } {
  const activeSeverities = cfg.severities.length > 0 ? cfg.severities : SEVERITIES;
  const activeServices   = cfg.services.length   > 0 ? cfg.services   : AVAILABLE_SERVICES;
  const rowCount = Math.min(cfg.max_rows, 50);

  const rows = Array.from({ length: rowCount }, (_, i) => ({
    timestamp: new Date(new Date(cfg.date_from).getTime() + i * 3600_000).toISOString(),
    service:   activeServices[i % activeServices.length],
    severity:  activeSeverities[i % activeSeverities.length],
    message:   `Log entry #${i + 1}: operation completed`,
    trace_id:  `trace-${(0xabcdef + i).toString(16)}`,
    duration_ms: 50 + (i * 7) % 200,
  }));

  if (cfg.format === "CSV") {
    const header = "timestamp,service,severity,message,trace_id,duration_ms\n";
    return {
      content: header + rows.map((r) => `${r.timestamp},${r.service},${r.severity},${r.message},${r.trace_id},${r.duration_ms}`).join("\n"),
      mime: "text/csv",
      ext: "csv",
    };
  }

  if (cfg.format === "NDJSON") {
    return { content: rows.map((r) => JSON.stringify(r)).join("\n"), mime: "application/x-ndjson", ext: "ndjson" };
  }

  if (cfg.format === "JSON") {
    return {
      content: JSON.stringify({ export_config: cfg, generated_at: new Date().toISOString(), total_rows: rows.length, rows }, null, 2),
      mime: "application/json",
      ext: "json",
    };
  }

  // PDF → printable HTML
  const html = `<!DOCTYPE html><html><head><title>Log Export ${cfg.date_from} to ${cfg.date_to}</title><style>body{font-family:sans-serif;padding:32px;color:#111;font-size:12px}h1{font-size:16px;margin-bottom:4px}p.meta{color:#666;margin-bottom:16px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:6px 8px;text-align:left}th{background:#f5f5f5;font-weight:600}.critical{color:#dc2626}.error{color:#ea580c}.warning{color:#d97706}.info{color:#0ea5e9}.debug{color:#64748b}</style></head><body><h1>Log Export</h1><p class="meta">Period: ${cfg.date_from} → ${cfg.date_to} &nbsp;|&nbsp; Services: ${activeServices.join(", ")} &nbsp;|&nbsp; Generated: ${new Date().toLocaleString()}</p><table><thead><tr><th>Timestamp</th><th>Service</th><th>Severity</th><th>Message</th><th>Trace ID</th><th>Duration (ms)</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.timestamp}</td><td>${r.service}</td><td class="${r.severity}">${r.severity}</td><td>${r.message}</td><td>${r.trace_id}</td><td>${r.duration_ms}</td></tr>`).join("")}</tbody></table></body></html>`;
  return { content: html, mime: "text/html", ext: "html" };
}

function triggerBlobDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const ExportPanel = () => {
  const dispatch = useAppDispatch();
  const [cfg, setCfg]         = useState<ExportConfig>(defaultConfig);
  const [exporting, setExporting] = useState(false);
  const [lastJob, setLastJob]     = useState<{ filename: string } | null>(null);

  const toggle = <K extends "services" | "severities">(key: K, val: string) => {
    setCfg((prev) => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  };

  const handleExport = async () => {
    setExporting(true);
    setLastJob(null);
    try {
      const result = await triggerExport(cfg);
      const { content, mime, ext } = buildExportContent(cfg);
      const filename = `${result.filename}.${ext}`;
      triggerBlobDownload(content, filename, mime);

      const newReport: Report = {
        id:           result.job_id,
        name:         `Export ${cfg.date_from} → ${cfg.date_to}`,
        type:         "full_export",
        format:       cfg.format,
        status:       "ready",
        created_at:   new Date().toISOString(),
        size_kb:      Math.round(content.length / 1024) || 1,
        rows:         Math.min(cfg.max_rows, 50),
        requested_by: "admin",
      };
      dispatch(prependReport(newReport));
      setLastJob({ filename });
    } finally {
      setExporting(false);
    }
  };

  const labelCls = "text-[11px] font-510 text-muted-foreground/60 mb-2 block";
  const inputCls = "w-full h-8 px-3 rounded-lg bg-accent/40 border border-border/60 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all";

  return (
    <div className="space-y-4">
      <Card className="border-border shadow-none gap-0 py-0">
        <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
          <CardTitle className="text-[13px] font-590 leading-none">Export Logs</CardTitle>
          <CardDescription className="text-[11px] mt-1 text-muted-foreground/60">
            Configure and download a filtered log export
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-6">

          {/* Format selector */}
          <div>
            <label className={labelCls}>Export Format</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FORMATS.map(({ value, label, desc, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setCfg((c) => ({ ...c, format: value }))}
                  className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                    cfg.format === value
                      ? "border-primary/50 bg-primary/6 text-foreground"
                      : "border-border/50 bg-accent/20 text-muted-foreground hover:border-border hover:bg-accent/40"
                  }`}
                >
                  <Icon className="h-4 w-4 mb-0.5" />
                  <span className="text-[12px] font-510">{label}</span>
                  <span className="text-[10px] opacity-60">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>From</label>
              <input
                type="date"
                value={cfg.date_from}
                max={cfg.date_to}
                onChange={(e) => setCfg((c) => ({ ...c, date_from: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>To</label>
              <input
                type="date"
                value={cfg.date_to}
                min={cfg.date_from}
                onChange={(e) => setCfg((c) => ({ ...c, date_to: e.target.value }))}
                className={inputCls}
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className={labelCls}>
              Services <span className="text-muted-foreground/40">(all if none selected)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SERVICES.map((svc) => (
                <button
                  key={svc}
                  onClick={() => toggle("services", svc)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-510 border transition-all ${
                    cfg.services.includes(svc)
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {svc}
                </button>
              ))}
            </div>
          </div>

          {/* Severities */}
          <div>
            <label className={labelCls}>
              Severity <span className="text-muted-foreground/40">(all if none selected)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SEVERITIES.map((sev) => (
                <button
                  key={sev}
                  onClick={() => toggle("severities", sev)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-510 capitalize border transition-all ${
                    cfg.severities.includes(sev)
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Max rows */}
          <div>
            <label className={labelCls}>Max Rows</label>
            <select
              value={cfg.max_rows}
              onChange={(e) => setCfg((c) => ({ ...c, max_rows: Number(e.target.value) }))}
              className={inputCls}
            >
              {[1_000, 5_000, 10_000, 50_000, 100_000].map((n) => (
                <option key={n} value={n}>{n.toLocaleString()}</option>
              ))}
            </select>
          </div>

          {/* Export button */}
          <div className="flex items-center gap-3 pt-2 border-t border-border/30">
            <Button onClick={() => void handleExport()} disabled={exporting} className="gap-2">
              {exporting
                ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…</>
                : <><Download className="h-3.5 w-3.5" /> Generate &amp; Download</>
              }
            </Button>

            {lastJob && (
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-510 animate-in fade-in-0">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {lastJob.filename} downloaded
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportPanel;
