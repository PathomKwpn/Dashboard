import { useState } from "react";
import ErrorRateChart    from "./components/ErrorRateChart";
import StatusCodeChart   from "./components/StatusCodeChart";
import TopEndpointsTable from "./components/TopEndpointsTable";
import SlowEndpointsTable from "./components/SlowEndpointsTable";
import UserAgentChart    from "./components/UserAgentChart";
import ServicePerformance from "./components/ServicePerformance";

/* ─── Tab definition ─────────────────────────────────────────────────────── */
const TABS = [
  { id: "error-rate",    label: "Error Rate"               },
  { id: "status-codes",  label: "Status Code Distribution" },
  { id: "top-endpoints", label: "Top Endpoints"            },
  { id: "slow-endpoints",label: "Slow Endpoints"           },
  { id: "user-agent",    label: "User Agent"               },
  { id: "service-perf",  label: "Service Performance"      },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ─── Page ───────────────────────────────────────────────────────────────── */
const LogAnalyticsPage = () => {
  const [tab, setTab] = useState<TabId>("error-rate");

  return (
    <div className="min-h-full bg-background">
      {/* Page header */}
      <div className="border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Log Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Deep-dive into error rates, endpoint performance, and traffic patterns
          </p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-border/40 bg-background overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0 min-w-max">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-3 text-[13px] font-510 transition-colors relative whitespace-nowrap
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
        {tab === "error-rate"     && <ErrorRateChart />}
        {tab === "status-codes"   && <StatusCodeChart />}
        {tab === "top-endpoints"  && <TopEndpointsTable />}
        {tab === "slow-endpoints" && <SlowEndpointsTable />}
        {tab === "user-agent"     && <UserAgentChart />}
        {tab === "service-perf"   && <ServicePerformance />}
      </div>
    </div>
  );
};

export default LogAnalyticsPage;
