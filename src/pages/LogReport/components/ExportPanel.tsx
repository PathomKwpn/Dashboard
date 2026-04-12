import { useState } from "react";
import { Download, FileText, FileSpreadsheet, FileCode, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AVAILABLE_SERVICES } from "../logReport.mock";
import type { ExportConfig, ReportFormat } from "../logReport.types";

/* ─── Config ─────────────────────────────────────────────────────────────── */
const FORMATS: { value: ReportFormat; label: string; desc: string; icon: React.ElementType }[] = [
  { value: "CSV",   label: "CSV",   desc: "Spreadsheet-compatible",    icon: FileSpreadsheet },
  { value: "JSON",  label: "JSON",  desc: "Structured, single file",   icon: FileCode        },
  { value: "NDJSON",label: "NDJSON",desc: "Newline-delimited, streaming", icon: FileCode     },
  { value: "PDF",   label: "PDF",   desc: "Formatted report",          icon: FileText        },
];

const SEVERITIES = ["critical", "error", "warning", "info", "debug"];

const today    = new Date().toISOString().slice(0, 10);
const weekAgo  = new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10);

const defaultConfig: ExportConfig = {
  format:     "CSV",
  date_from:  weekAgo,
  date_to:    today,
  services:   [],
  severities: [],
  max_rows:   10_000,
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const ExportPanel = () => {
  const [cfg, setCfg]           = useState<ExportConfig>(defaultConfig);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported]   = useState(false);

  const toggle = <K extends "services" | "severities">(key: K, val: string) => {
    setCfg((prev) => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  };

  const handleExport = async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setExporting(false);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
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
              <input type="date" value={cfg.date_from}
                onChange={(e) => setCfg((c) => ({ ...c, date_from: e.target.value }))}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>To</label>
              <input type="date" value={cfg.date_to}
                onChange={(e) => setCfg((c) => ({ ...c, date_to: e.target.value }))}
                className={inputCls} />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className={labelCls}>Services <span className="text-muted-foreground/40">(all if none selected)</span></label>
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
            <label className={labelCls}>Severity <span className="text-muted-foreground/40">(all if none selected)</span></label>
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
            <Button
              onClick={handleExport}
              disabled={exporting}
              className="gap-2"
            >
              {exporting ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…</>
              ) : exported ? (
                <><Download className="h-3.5 w-3.5" /> Download Ready</>
              ) : (
                <><Download className="h-3.5 w-3.5" /> Generate Export</>
              )}
            </Button>
            {exported && (
              <span className="text-[11px] text-emerald-400 font-510 animate-in fade-in-0">
                Export generated successfully
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportPanel;
