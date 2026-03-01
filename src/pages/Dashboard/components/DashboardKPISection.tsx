import KPICard from "@/components/common/KPICard";
import type { DashboardSummary } from "../dashboard.types";

interface DashboardKPISectionProps {
  summary: DashboardSummary;
}

const DashboardKPISection = ({ summary }: DashboardKPISectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        label="Total Events"
        value={summary.total_events?.toLocaleString() ?? "-"}
        description="Total logs processed"
      />
      <KPICard
        label="Critical"
        value={summary.severity.critical?.toLocaleString() ?? "-"}
        description="Immediate action required"
      />
      <KPICard
        label="High"
        value={summary.severity.high?.toLocaleString() ?? "-"}
        description="High risk alerts"
      />
      <KPICard
        label="Medium"
        value={summary.severity.medium?.toLocaleString() ?? "-"}
        description="Potential issues"
      />
    </div>
  );
};

export default DashboardKPISection;
