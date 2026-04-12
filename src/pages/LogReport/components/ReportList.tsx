import { useEffect, useState } from "react";
import moment from "moment";
import { Download, RefreshCw, FileText, FileSpreadsheet, FileCode } from "lucide-react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchReports } from "../logReport.mock";
import type { Report, ReportStatus, ReportFormat } from "../logReport.types";

/* ─── Config ─────────────────────────────────────────────────────────────── */
const STATUS_CFG: Record<ReportStatus, { label: string; cls: string; dot: string }> = {
  ready:      { label: "Ready",      cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500"    },
  generating: { label: "Generating", cls: "bg-sky-500/10 text-sky-400 border-sky-500/20",             dot: "bg-sky-400 animate-pulse" },
  failed:     { label: "Failed",     cls: "bg-red-500/10 text-red-400 border-red-500/20",             dot: "bg-red-500"        },
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

/* ─── Component ──────────────────────────────────────────────────────────── */
const ReportList = () => {
  const [data, setData]       = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setData(await fetchReports());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

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
          <Button variant="ghost" size="icon-sm" onClick={load} className="text-muted-foreground/50 hover:text-foreground">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        {/* Column headers */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 px-5 py-2 border-b border-border/30 bg-background">
          {["Report Name", "Type", "Format", "Status", "Created", ""].map((h) => (
            <span key={h} className="text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider">
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="px-5 py-4 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
          </div>
        ) : (
          data.map((r) => {
            const st = STATUS_CFG[r.status];
            return (
              <div
                key={r.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 items-center px-5 py-3
                           border-b border-border/20 last:border-0 hover:bg-accent/40 transition-colors"
              >
                {/* Name */}
                <div className="min-w-0">
                  <p className="text-[12px] font-510 text-foreground/85 truncate">{r.name}</p>
                  {r.rows != null && (
                    <p className="text-[10px] text-muted-foreground/40 mt-0.5 tabular-nums">
                      {r.rows.toLocaleString()} rows
                    </p>
                  )}
                </div>

                {/* Type */}
                <span className="text-[11px] text-muted-foreground/70">{TYPE_LABELS[r.type]}</span>

                {/* Format */}
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                  <FormatIcon fmt={r.format} />
                  {r.format}
                  {r.size_kb && (
                    <span className="text-muted-foreground/40">
                      · {r.size_kb >= 1024 ? `${(r.size_kb / 1024).toFixed(1)} MB` : `${r.size_kb} KB`}
                    </span>
                  )}
                </div>

                {/* Status */}
                <Badge variant="outline" className={`text-[10px] font-510 rounded-sm px-1.5 py-0.5 w-fit ${st.cls}`}>
                  <span className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${st.dot}`} />
                  {st.label}
                </Badge>

                {/* Created */}
                <span className="text-[11px] text-muted-foreground/50 tabular-nums">
                  {moment(r.created_at).fromNow()}
                </span>

                {/* Action */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={r.status !== "ready"}
                  className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20"
                  title="Download"
                >
                  <Download className="h-3.5 w-3.5" />
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
