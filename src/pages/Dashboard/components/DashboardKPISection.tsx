import KPICard from "@/components/common/KPICard";
import { Activity, ShieldAlert, Gauge, Timer } from "lucide-react";
import type { DashboardSummary } from "../dashboard.types";

interface DashboardKPISectionProps {
  summary: DashboardSummary;
}

const DashboardKPISection = ({ summary }: DashboardKPISectionProps) => {
  const c = summary.changes ?? {};

  return (
    <div className="space-y-3">
      {/* ── KPI cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard
          label="Total Log Volume"
          value={summary.total_logs?.toLocaleString() ?? "-"}
          description="Ingested today"
          change={c.total_logs}
          icon={<Activity size={16} />}
          accent="primary"
        />
        <KPICard
          label="Critical Alerts"
          value={summary.critical_alerts?.toLocaleString() ?? "-"}
          description="Requires attention"
          change={c.critical_alerts}
          icon={<ShieldAlert size={16} />}
          accent="destructive"
        />
        <KPICard
          label="Error Rate"
          value={`${summary.error_rate?.toFixed(1) ?? "-"}%`}
          description="Error-level entries"
          change={c.error_rate}
          icon={<Gauge size={16} />}
          accent="warning"
        />
        <KPICard
          label="Avg Response Time"
          value={`${summary.avg_response_ms?.toLocaleString() ?? "-"} ms`}
          description="Service latency"
          change={c.avg_response_ms}
          icon={<Timer size={16} />}
          accent="success"
        />
      </div>
    </div>
  );
};

export default DashboardKPISection;
