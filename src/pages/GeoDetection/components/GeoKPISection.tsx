import { Activity, ShieldAlert, Globe, ShieldCheck } from "lucide-react";
import KPICard from "@/components/common/KPICard";
import type { GeoSummary } from "../geoDetection.types";

interface Props { summary: GeoSummary; }

const GeoKPISection = ({ summary }: Props) => {
  const c = summary.changes ?? {};
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <KPICard
        label="Detection Events"
        value={summary.total_events.toLocaleString()}
        description="Today"
        change={c.total_events}
        icon={<Activity size={16} />}
        accent="primary"
      />
      <KPICard
        label="Suspicious IPs"
        value={summary.suspicious_ips.toLocaleString()}
        description="Active threats"
        change={c.suspicious_ips}
        icon={<ShieldAlert size={16} />}
        accent="destructive"
      />
      <KPICard
        label="Origin Countries"
        value={summary.countries_detected.toLocaleString()}
        description="Unique sources"
        change={c.countries_detected}
        icon={<Globe size={16} />}
        accent="warning"
      />
      <KPICard
        label="Blocked Attacks"
        value={summary.blocked_attacks.toLocaleString()}
        description="Auto-mitigated"
        change={c.blocked_attacks}
        icon={<ShieldCheck size={16} />}
        accent="success"
      />
    </div>
  );
};

export default GeoKPISection;
