import { useState } from "react";
import moment from "moment";
import { Download, RefreshCw, FileText, FileSpreadsheet, FileCode, Loader2 } from "lucide-react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchReports } from "../logReport.thunks";
import type { Report, ReportStatus, ReportFormat } from "../logReport.types";

/* ─── Config ─────────────────────────────────────────────────────────────── */
const STATUS_CFG: Record<ReportStatus, { label: string; cls: string; dot: string }> = {
  ready:      { label: "Ready",      cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500"           },
  generating: { label: "Generating", cls: "bg-sky-500/10 text-sky-400 border-sky-500/20",             dot: "bg-sky-400 animate-pulse" },
  failed:     { label: "Failed",     cls: "bg-red-500/10 text-red-400 border-red-500/20",             dot: "bg-red-500"               },
};

const TYPE_LABELS: Record<Report["type"], string> = {
  error_summary:    "Error Summary",
  traffic_summary:  "Traffic Summary",
  log_distribution: "Log Distribution",
  full_export:      "Full Export",
};

const FormatIcon = ({ fmt }: { fmt: ReportFormat }) => {
  if (fmt === "PDF") return <FileText className="h-3.5 w-3.5" />;
  if (fmt === "CSV") return <FileSpreadsheet className="h-3.5 w-3.5" />;
  return <FileCode className="h-3.5 w-3.5" />;
};

/* ─── Download helpers ───────────────────────────────────────────────────── */
function triggerBlobDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

function buildReportContent(report: Report): { content: string; mime: string; ext: string } {
  const sampleRows = Array.from({ length: 20 }, (_, i) => ({
    ts: `2026-04-24T${String(i).padStart(2, "0")}:00:00Z`,
    service: "auth-service",
    severity: "error",
    message: `Sample log entry ${i + 1}`,
  }));

  if (report.format === "CSV") {
    const header = `Report: ${report.name}\nType: ${TYPE_LABELS[report.type]}\nGenerated: ${new Date().toISOString()}\n\n`;
    const rows   = ["timestamp,service,severity,message", ...sampleRows.map((r) => `${r.ts},${r.service},${r.severity},${r.message}`)];
    return { content: header + rows.join("\n"), mime: "text/csv", ext: "csv" };
  }

  if (report.format === "NDJSON") {
    return { content: sampleRows.map((r) => JSON.stringify(r)).join("\n"), mime: "application/x-ndjson", ext: "ndjson" };
  }

  if (report.format === "JSON") {
    return {
      content: JSON.stringify({ report: report.name, generated_at: new Date().toISOString(), rows: sampleRows }, null, 2),
      mime: "application/json",
      ext: "json",
    };
  }

  // PDF → printable HTML
  const html = `<!DOCTYPE html><html><head><title>${report.name}</title><style>body{font-family:sans-serif;padding:32px;color:#111}h1{font-size:18px;margin-bottom:4px}p{color:#666;font-size:12px;margin-bottom:16px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px;font-size:12px;text-align:left}th{background:#f5f5f5}</style></head><body><h1>${report.name}</h1><p>Type: ${TYPE_LABELS[report.type]} &nbsp;|&nbsp; Generated: ${new Date().toLocaleString()}</p><table><thead><tr><th>Timestamp</th><th>Service</th><th>Severity</th><th>Message</th></tr></thead><tbody>${sampleRows.map((r) => `<tr><td>${r.ts}</td><td>${r.service}</td><td>${r.severity}</td><td>${r.message}</td></tr>`).join("")}</tbody></table></body></html>`;
  return { content: html, mime: "text/html", ext: "html" };
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const ReportList = () => {
  const dispatch = useAppDispatch();
  const { reports, reportsLoading, error } = useAppSelector((s) => s.logReport);
  const [downloading, setDownloading] = useState<string | null>(null);

  const reload = () => { dispatch(fetchReports()); };

  const handleDownload = async (report: Report) => {
    setDownloading(report.id);
    await new Promise((r) => setTimeout(r, 400));
    const { content, mime, ext } = buildReportContent(report);
    const safeName = report.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    triggerBlobDownload(content, `${safeName}.${ext}`, mime);
    setDownloading(null);
  };

  return (
    <Card className="border-border shadow-none gap-0 py-0">
      <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[13px] font-590 leading-none">Report List</CardTitle>
            <CardDescription className="text-[11px] mt-1 text-muted-foreground/60">
              Generated reports available for download
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={reload}
            disabled={reportsLoading}
            className="text-muted-foreground/50 hover:text-foreground"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${reportsLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        {error && (
          <div className="mx-5 mt-3 mb-1 px-3 py-2 rounded-lg bg-red-500/8 border border-red-500/20 text-[11px] text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 px-5 py-2 border-b border-border/30 bg-background">
          {["Report Name", "Type", "Format", "Status", "Created", ""].map((h) => (
            <span key={h} className="text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {reportsLoading ? (
          <div className="px-5 py-4 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <FileText className="h-8 w-8 text-muted-foreground/20 mb-3" />
            <p className="text-[13px] text-muted-foreground/50">No reports found</p>
            <p className="text-[11px] text-muted-foreground/35 mt-1">Generate a report from the Export tab</p>
          </div>
        ) : (
          reports.map((r) => {
            const st = STATUS_CFG[r.status];
            const isDownloading = downloading === r.id;
            return (
              <div
                key={r.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 items-center px-5 py-3
                           border-b border-border/20 last:border-0 hover:bg-accent/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-[12px] font-510 text-foreground/85 truncate">{r.name}</p>
                  {r.rows != null && (
                    <p className="text-[10px] text-muted-foreground/40 mt-0.5 tabular-nums">
                      {r.rows.toLocaleString()} rows
                    </p>
                  )}
                </div>

                <span className="text-[11px] text-muted-foreground/70">{TYPE_LABELS[r.type]}</span>

                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                  <FormatIcon fmt={r.format} />
                  {r.format}
                  {r.size_kb != null && (
                    <span className="text-muted-foreground/40">
                      · {r.size_kb >= 1024 ? `${(r.size_kb / 1024).toFixed(1)} MB` : `${r.size_kb} KB`}
                    </span>
                  )}
                </div>

                <Badge variant="outline" className={`text-[10px] font-510 rounded-sm px-1.5 py-0.5 w-fit ${st.cls}`}>
                  <span className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${st.dot}`} />
                  {st.label}
                </Badge>

                <span className="text-[11px] text-muted-foreground/50 tabular-nums">
                  {moment(r.created_at).fromNow()}
                </span>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={r.status !== "ready" || isDownloading}
                  onClick={() => void handleDownload(r)}
                  className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20"
                  title={r.status === "ready" ? "Download" : r.status === "generating" ? "Still generating…" : "Failed — cannot download"}
                >
                  {isDownloading
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Download className="h-3.5 w-3.5" />}
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ReportList;
