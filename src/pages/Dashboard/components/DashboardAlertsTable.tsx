import moment from "moment";
import type { EventItem } from "../dashboard.types";

interface DashboardAlertsTableProps {
  events: EventItem[];
}

const riskBadgeClass: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

const DashboardAlertsTable = ({ events }: DashboardAlertsTableProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Top Alerts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Recent log anomalies and spikes
          </p>
        </div>
        <button className="text-sm text-primary hover:underline">
          View full report →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border/50">
            <tr className="text-left">
              <th className="pb-4 font-semibold text-muted-foreground">Time</th>
              <th className="pb-4 font-semibold text-muted-foreground">Risk</th>
              <th className="pb-4 font-semibold text-muted-foreground">
                Source IP
              </th>
              <th className="pb-4 font-semibold text-muted-foreground">
                Country
              </th>
              <th className="pb-4 font-semibold text-muted-foreground">
                Events
              </th>
              <th className="pb-4 font-semibold text-muted-foreground">
                Change
              </th>
              <th className="pb-4 font-semibold text-muted-foreground">
                Growth
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="py-4">
                  <span className="text-xs text-muted-foreground">
                    {moment(item.detect_time).format("YYYY-MM-DD HH:mm")}
                  </span>
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                      riskBadgeClass[item.risk_level] ?? ""
                    }`}
                  >
                    {item.risk_level}
                  </span>
                </td>
                <td className="py-4">
                  <span className="font-medium text-foreground">
                    {item.source_ip}
                  </span>
                </td>
                <td className="py-4">
                  <span className="text-muted-foreground">{item.country}</span>
                </td>
                <td className="py-4">
                  <span className="font-semibold">
                    {item.events.toLocaleString()}
                  </span>
                </td>
                <td className="py-4">
                  <span className="text-muted-foreground">
                    {item.diff >= 0 ? "+" : ""}
                    {item.diff.toLocaleString()}
                  </span>
                </td>
                <td className="py-4">
                  <span
                    className={`font-semibold ${
                      item.growth_percent >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.growth_percent >= 0 ? "+" : ""}
                    {item.growth_percent.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAlertsTable;
