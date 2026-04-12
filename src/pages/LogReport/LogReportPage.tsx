import { useState } from "react";
import ReportList     from "./components/ReportList";
import ErrorSummary   from "./components/ErrorSummary";
import TrafficSummary from "./components/TrafficSummary";
import LogDistribution from "./components/LogDistribution";
import ExportPanel    from "./components/ExportPanel";

/* ─── Tab definition ─────────────────────────────────────────────────────── */
const TABS = [
  { id: "reports",     label: "Report List"      },
  { id: "errors",      label: "Error Summary"    },
  { id: "traffic",     label: "Traffic Summary"  },
  { id: "distribution",label: "Log Distribution" },
  { id: "export",      label: "Export"           },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ─── Page ───────────────────────────────────────────────────────────────── */
const LogReportPage = () => {
  const [tab, setTab] = useState<TabId>("reports");

  return (
    <div className="min-h-full bg-background">
      {/* Page header */}
      <div className="border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Log Report</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Generated reports, summaries, and log exports
          </p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-border/40 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-3 text-[13px] font-510 transition-colors relative
                  ${tab === t.id
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-t-full"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {tab === "reports"      && <ReportList />}
        {tab === "errors"       && <ErrorSummary />}
        {tab === "traffic"      && <TrafficSummary />}
        {tab === "distribution" && <LogDistribution />}
        {tab === "export"       && <ExportPanel />}
      </div>
    </div>
  );
};

export default LogReportPage;
