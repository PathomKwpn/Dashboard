import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import worldGeoJson from "@/assets/world.json";
import type { AttackOrigin } from "@/pages/GeoDetection/geoDetection.types";

/* ─── Constants ──────────────────────────────────────────────────────────── */
const THREAT_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high:     "#f97316",
  medium:   "#eab308",
  low:      "#6b7280",
};

/* Register the pre-processed world GeoJSON once at module level */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
echarts.registerMap("world", worldGeoJson as any);

/* ─── Props ──────────────────────────────────────────────────────────────── */
interface GeoMapChartProps {
  data:    AttackOrigin[];
  height?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const GeoMapChart = ({ data, height = "420px" }: GeoMapChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<echarts.ECharts | null>(null);

  /* ── Init chart ── */
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = echarts.init(containerRef.current, null, {
      renderer:         "canvas",
      devicePixelRatio: window.devicePixelRatio ?? 1,
    });
    chartRef.current = chart;

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  /* ── Update option when data changes ── */
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const maxCount = Math.max(...data.map((d) => d.attack_count), 1);

    const makeScatterSeries = (level: string, effect: boolean) => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      type: effect ? "effectScatter" : "scatter",
      coordinateSystem: "geo",
      data: data
        .filter((d) => d.threat_level === level)
        .map((d) => ({
          name:         d.country,
          value:        [d.lng, d.lat, d.attack_count],
          blocked:      d.blocked_count,
          threatLevel:  d.threat_level,
        })),
      symbolSize: (val: number[]) =>
        Math.max(6, Math.min(22, (val[2] / maxCount) * 16 + 6)),
      itemStyle: {
        color:   THREAT_COLORS[level] ?? "#6b7280",
        opacity: 0.92,
        shadowBlur:  effect ? 12 : 6,
        shadowColor: THREAT_COLORS[level] ?? "#6b7280",
      },
      ...(effect
        ? {
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
              scale:     3.5,
              period:    4,
              color:     THREAT_COLORS[level],
            },
          }
        : {}),
      zlevel: effect ? 2 : 1,
    });

    chart.setOption(
      {
        backgroundColor: "transparent",

        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(15,23,42,0.95)",
          borderColor:     "rgba(255,255,255,0.08)",
          borderWidth:     1,
          padding:         [10, 14],
          textStyle: { color: "#f8fafc", fontSize: 12 },
          formatter: (params: Record<string, unknown>) => {
            if (!params.data || !(params.data as Record<string, unknown>).value) return "";
            const d = params.data as {
              name: string;
              value: [number, number, number];
              blocked: number;
              threatLevel: string;
            };
            const attacks  = d.value[2];
            const blocked  = d.blocked;
            const rate     = attacks > 0 ? Math.round((blocked / attacks) * 100) : 0;
            const dot      = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${THREAT_COLORS[d.threatLevel]};margin-right:6px;"></span>`;
            return `
              <div style="min-width:160px">
                <div style="display:flex;align-items:center;padding-bottom:8px;margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.08);">
                  ${dot}<span style="font-weight:600;font-size:13px">${d.name}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                  <span style="color:#94a3b8">Attacks</span>
                  <span style="font-weight:600;font-variant-numeric:tabular-nums">${attacks.toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                  <span style="color:#94a3b8">Blocked</span>
                  <span style="color:#34d399;font-weight:600;font-variant-numeric:tabular-nums">${blocked.toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                  <span style="color:#94a3b8">Block rate</span>
                  <span style="color:#60a5fa;font-weight:600">${rate}%</span>
                </div>
                <div style="height:4px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden">
                  <div style="height:100%;width:${rate}%;background:#10b981;border-radius:4px"></div>
                </div>
              </div>
            `;
          },
        },

        legend: {
          show:      true,
          bottom:    12,
          right:     12,
          orient:    "vertical",
          itemWidth:  10,
          itemHeight: 10,
          textStyle: { color: "#94a3b8", fontSize: 11 },
          backgroundColor: "rgba(0,0,0,0.45)",
          borderRadius:    8,
          padding:         [8, 12],
          data: ["Critical", "High", "Medium", "Low"],
        },

        geo: {
          map:    "world",
          roam:   true,
          zoom:   1.15,
          center: [15, 20],
          itemStyle: {
            areaColor:   "#1e293b",
            borderColor: "rgba(255,255,255,0.06)",
            borderWidth: 0.5,
          },
          emphasis: {
            itemStyle: {
              areaColor: "#334155",
              borderColor: "rgba(255,255,255,0.12)",
            },
            label: { show: false },
          },
          select: {
            itemStyle: { areaColor: "#3b4f6b" },
            label: { show: false },
          },
          label: { show: false },
          zlevel: 0,
        },

        series: [
          makeScatterSeries("critical", true),
          makeScatterSeries("high",     false),
          makeScatterSeries("medium",   false),
          makeScatterSeries("low",      false),
        ],
      },
      true,
    );
  }, [data]);

  return (
    <div
      style={{
        height,
        background: "linear-gradient(145deg, #0c1220 0%, #111827 50%, #0c1220 100%)",
      }}
      className="relative w-full rounded-xl overflow-hidden border border-white/5"
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default GeoMapChart;
