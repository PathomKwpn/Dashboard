import moment from "moment";
import type { AlertStatus, RiskLevel, RecentAlert } from "../dashboard.types";

interface Props {
  alerts: RecentAlert[];
}

const severityStyle: Record<RiskLevel, { label: string; cls: string }> = {
  critical: {
    label: "Critical",
    cls: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/15",
  },
  high: {
    label: "High",
    cls: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/15",
  },
  medium: {
    label: "Medium",
    cls: "text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/15",
  },
  low: {
    label: "Low",
    cls: "text-muted-foreground bg-muted/60",
  },
};

const statusStyle: Record<AlertStatus, { label: string; cls: string }> = {
  open: {
    label: "Open",
    cls: "text-red-600 dark:text-red-400",
  },
  ack: {
    label: "Acknowledged",
    cls: "text-sky-600 dark:text-sky-400",
  },
  resolved: {
    label: "Resolved",
    cls: "text-emerald-600 dark:text-emerald-400",
  },
};

const DashboardAlertsTable = ({ alerts }: Props) => {
  return (
    <div className="bg-card rounded-lg border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Recent Alerts
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Latest security and anomaly events
          </p>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {alerts.length} alerts
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              {[
                "ID",
                "Time",
                "Severity",
                "Source IP",
                "Service",
                "Message",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {alerts.map((alert) => {
              const sv = severityStyle[alert.severity] ?? severityStyle.low;
              const st = statusStyle[alert.status] ?? statusStyle.open;
              return (
                <tr
                  key={alert.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {alert.id}
                  </td>

                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {moment(alert.timestamp).format("MMM DD, HH:mm")}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${sv.cls}`}
                    >
                      {sv.label}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-mono text-xs">
                    {alert.source_ip}
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-xs font-medium">{alert.service}</span>
                  </td>

                  <td className="px-4 py-3 max-w-sm">
                    <p className="truncate text-xs text-foreground/80">
                      {alert.message}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium ${st.cls}`}>
                      {st.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAlertsTable;
