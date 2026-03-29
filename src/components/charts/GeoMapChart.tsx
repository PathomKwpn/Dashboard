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

const THREAT_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high:     "#f97316",
  medium:   "#eab308",
  low:      "#94a3b8",
};

const THREAT_GLOW: Record<string, string> = {
  critical: "rgba(239,68,68,0.30)",
  high:     "rgba(249,115,22,0.25)",
  medium:   "rgba(234,179,8,0.20)",
  low:      "rgba(148,163,184,0.15)",
};

/* ─── Props ──────────────────────────────────────────────────────────────── */
interface GeoMapChartProps {
  data:    AttackOrigin[];
  height?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const GeoMapChart = ({ data, height = "400px" }: GeoMapChartProps) => {
  const [tooltip, setTooltip]   = useState<AttackOrigin | null>(null);
  const [tooltipXY, setTooltipXY] = useState({ x: 0, y: 0 });

  const maxCount = Math.max(...data.map((d) => d.attack_count), 1);
  const getRadius = (count: number) =>
    Math.max(4, Math.min(16, (count / maxCount) * 13 + 4));

  const blockPct = tooltip
    ? Math.round((tooltip.blocked_count / tooltip.attack_count) * 100)
    : 0;

  return (
    <>
      <div
        style={{
          height,
          background: "linear-gradient(160deg, #060d1a 0%, #0a1628 60%, #060d1a 100%)",
        }}
        className="relative w-full rounded-xl overflow-hidden select-none"
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
                  fill="#0d1d35"
                  stroke="#ffffff0b"
                  strokeWidth={0.35}
                  style={{
                    default: { outline: "none" },
                    hover:   { outline: "none", fill: "#122040" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* ── Attack markers (render small ones first so large ones appear on top) ── */}
          {[...data]
            .sort((a, b) => a.attack_count - b.attack_count)
            .map((origin) => {
              const r       = getRadius(origin.attack_count);
              const color   = THREAT_COLORS[origin.threat_level] ?? "#94a3b8";
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
                  {/* Animated pulse ring for critical / high */}
                  {isPulse && (
                    <circle r={r} fill={color} opacity={0}>
                      <animate
                        attributeName="r"
                        values={`${r};${r * 2.8}`}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.30;0"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Soft halo */}
                  <circle
                    r={r * 2}
                    fill={glow}
                    opacity={0.6}
                    style={{ pointerEvents: "none" }}
                  />

                  {/* Core dot */}
                  <circle
                    r={r}
                    fill={color}
                    opacity={0.88}
                    style={{ cursor: "pointer", transition: "r 0.15s" }}
                  />

                  {/* Specular highlight */}
                  <circle
                    r={r * 0.35}
                    cx={-r * 0.28}
                    cy={-r * 0.28}
                    fill="white"
                    opacity={0.30}
                    style={{ pointerEvents: "none" }}
                  />
                </Marker>
              );
            })}
        </ComposableMap>

        {/* ── Threat level legend ── */}
        <div className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-sm rounded-lg px-3 py-2.5 space-y-1.5">
          <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Threat Level</p>
          {(["critical", "high", "medium", "low"] as const).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{
                  background: THREAT_COLORS[level],
                  boxShadow: `0 0 4px ${THREAT_COLORS[level]}88`,
                }}
              />
              <span className="text-[10px] capitalize text-white/55">{level}</span>
            </div>
          ))}
        </div>

        {/* ── Dot size legend ── */}
        <div className="absolute top-3 right-3 flex items-center gap-3">
          {([["Low", 7], ["Med", 11], ["High", 16]] as [string, number][]).map(([label, size]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="rounded-full bg-white/20"
                style={{ width: size, height: size }}
              />
              <span className="text-[9px] text-white/30">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Footer info ── */}
        <div className="absolute bottom-3 right-3 text-[9px] font-mono text-white/15 tracking-wide">
          Equal Earth · {data.length} origins
        </div>
      </div>

      {/* ── Floating tooltip ── */}
      {tooltip && (
        <div
          className="fixed z-200 pointer-events-none bg-zinc-900/95 border border-white/10
                     rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm min-w-45"
          style={{ left: tooltipXY.x + 16, top: tooltipXY.y - 16 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: THREAT_COLORS[tooltip.threat_level] }}
            />
            <p className="text-sm font-semibold text-foreground/95">{tooltip.country}</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-6 text-xs">
              <span className="text-muted-foreground/60">Total Attacks</span>
              <span className="tabular-nums font-medium text-foreground/90">
                {tooltip.attack_count.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-6 text-xs">
              <span className="text-muted-foreground/60">Blocked</span>
              <span className="tabular-nums font-medium text-emerald-400">
                {tooltip.blocked_count.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-6 text-xs">
              <span className="text-muted-foreground/60">Block Rate</span>
              <span className="tabular-nums font-medium text-sky-400">{blockPct}%</span>
            </div>
          </div>
          <div className="mt-2.5 h-1 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500/70"
              style={{ width: `${blockPct}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GeoMapChart;
