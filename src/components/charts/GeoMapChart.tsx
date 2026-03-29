import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import type { AttackOrigin } from "@/pages/GeoDetection/geoDetection.types";

/* ─── Config ─────────────────────────────────────────────────────────────── */
const GEO_URL = "/map/world-110m.json";

/* Apple-inspired threat palette — restrained, professional */
const THREAT_COLORS: Record<string, string> = {
  critical: "#dc2626",
  high:     "#ea580c",
  medium:   "#d97706",
  low:      "#6b7280",
};

const THREAT_GLOW: Record<string, string> = {
  critical: "rgba(220,38,38,0.12)",
  high:     "rgba(234,88,12,0.10)",
  medium:   "rgba(217,119,6,0.08)",
  low:      "rgba(107,114,128,0.06)",
};

/* ─── Props ──────────────────────────────────────────────────────────────── */
interface GeoMapChartProps {
  data:    AttackOrigin[];
  height?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const GeoMapChart = ({ data, height = "400px" }: GeoMapChartProps) => {
  const [tooltip, setTooltip]     = useState<AttackOrigin | null>(null);
  const [tooltipXY, setTooltipXY] = useState({ x: 0, y: 0 });

  const maxCount  = Math.max(...data.map((d) => d.attack_count), 1);
  const getRadius = (count: number) =>
    Math.max(3.5, Math.min(14, (count / maxCount) * 11 + 3.5));

  const blockPct = tooltip
    ? Math.round((tooltip.blocked_count / tooltip.attack_count) * 100)
    : 0;

  return (
    <>
      <div
        style={{
          height,
          background: "linear-gradient(145deg, #0c1220 0%, #111827 50%, #0c1220 100%)",
        }}
        className="relative w-full rounded-xl overflow-hidden select-none border border-white/5"
        onMouseMove={(e) => tooltip && setTooltipXY({ x: e.clientX, y: e.clientY })}
      >
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 155, center: [0, 0] }}
          style={{ width: "100%", height: "100%" }}
        >
          {/* ── Country fills ── */}
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1e293b"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none", transition: "fill 0.2s ease" },
                    hover:   { outline: "none", fill: "#334155", transition: "fill 0.2s ease" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* ── Attack markers ── */}
          {[...data]
            .sort((a, b) => a.attack_count - b.attack_count)
            .map((origin) => {
              const r       = getRadius(origin.attack_count);
              const color   = THREAT_COLORS[origin.threat_level] ?? "#6b7280";
              const glow    = THREAT_GLOW[origin.threat_level]   ?? "transparent";
              const isPulse = origin.threat_level === "critical" || origin.threat_level === "high";

              return (
                <Marker
                  key={origin.country_code}
                  coordinates={[origin.lng, origin.lat]}
                  onMouseEnter={(e) => {
                    setTooltip(origin);
                    setTooltipXY({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* Subtle pulse for critical / high */}
                  {isPulse && (
                    <circle r={r} fill={color} opacity={0}>
                      <animate
                        attributeName="r"
                        values={`${r};${r * 2}`}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.15;0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Ambient glow */}
                  <circle
                    r={r * 1.5}
                    fill={glow}
                    opacity={0.5}
                    style={{ pointerEvents: "none" }}
                  />

                  {/* Core marker */}
                  <circle
                    r={r}
                    fill={color}
                    opacity={0.9}
                    style={{
                      cursor: "pointer",
                      transition: "r 0.2s ease",
                    }}
                  />

                  {/* Inner highlight ring */}
                  <circle
                    r={r * 0.45}
                    fill="none"
                    stroke="white"
                    strokeWidth={0.4}
                    opacity={0.2}
                    style={{ pointerEvents: "none" }}
                  />
                </Marker>
              );
            })}
        </ComposableMap>

        {/* ── Threat legend ── */}
        <div className="absolute bottom-3.5 left-3.5 bg-black/50 backdrop-blur-md rounded-lg px-3.5 py-3 space-y-1.5 border border-white/6">
          <p className="text-[10px] font-medium tracking-wide text-slate-400 mb-2">Threat Level</p>
          {(["critical", "high", "medium", "low"] as const).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: THREAT_COLORS[level] }}
              />
              <span className="text-[11px] capitalize text-slate-300">{level}</span>
            </div>
          ))}
        </div>

        {/* ── Volume legend ── */}
        <div className="absolute top-3.5 right-3.5 bg-black/50 backdrop-blur-md rounded-lg px-3.5 py-3 border border-white/6">
          <p className="text-[10px] font-medium tracking-wide text-slate-400 mb-2">Volume</p>
          <div className="space-y-1.5">
            {([["Low", 5], ["Med", 9], ["High", 13]] as [string, number][]).map(([label, size]) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="rounded-full bg-white/15"
                  style={{ width: size, height: size }}
                />
                <span className="text-[11px] text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="absolute bottom-3.5 right-3.5 text-[10px] font-mono text-slate-500">
          {data.length} origins
        </div>
      </div>

      {/* ── Tooltip ── */}
      {tooltip && (
        <div
          className="fixed z-200 pointer-events-none bg-gray-900/95 border border-white/8
                     rounded-xl px-4 py-3.5 shadow-2xl backdrop-blur-lg min-w-52"
          style={{ left: tooltipXY.x + 14, top: tooltipXY.y - 14 }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/8">
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: THREAT_COLORS[tooltip.threat_level] }}
            />
            <div>
              <p className="text-sm font-semibold text-white">{tooltip.country}</p>
              <p className="text-[10px] text-slate-400 capitalize">{tooltip.threat_level} threat</p>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Attacks</span>
              <span className="tabular-nums text-sm font-medium text-white">
                {tooltip.attack_count.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Blocked</span>
              <span className="tabular-nums text-sm font-medium text-emerald-400">
                {tooltip.blocked_count.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Block Rate</span>
              <span className="tabular-nums text-sm font-medium text-blue-400">{blockPct}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1 w-full rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500/60"
              style={{ width: `${blockPct}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GeoMapChart;
