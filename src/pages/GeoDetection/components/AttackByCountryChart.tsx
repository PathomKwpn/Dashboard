import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import * as echarts from "echarts";
import {
  Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AttackByCountry } from "../geoDetection.types";

interface Props {
  data:    AttackByCountry[];
  loading: boolean;
}

const AttackByCountryChart = ({ data, loading }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const instance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const chart = echarts.init(chartRef.current, undefined, { renderer: "svg" });
    instance.current = chart;

    const top10     = data.slice(0, 10);
    const countries = top10.map((d) => d.country).reverse();
    const blocked   = top10.map((d) => d.blocked).reverse();
    const passed    = top10.map((d) => d.passed).reverse();

    chart.setOption({
      backgroundColor: "transparent",
      grid: { left: 12, right: 20, top: 8, bottom: 8, containLabel: true },
      xAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#ffffff0a" } },
        axisLabel: { color: "#64748b", fontSize: 10 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "category",
        data: countries,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#94a3b8", fontSize: 11, fontFamily: "monospace" },
      },
      series: [
        {
          name: "Blocked",
          type: "bar",
          stack: "total",
          barMaxWidth: 14,
          data: blocked,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "rgba(34,197,94,0.25)" },
              { offset: 1, color: "rgba(34,197,94,0.55)" },
            ]),
            borderRadius: [0, 0, 0, 0],
          },
          emphasis: { itemStyle: { color: "rgba(34,197,94,0.70)" } },
        },
        {
          name: "Passed",
          type: "bar",
          stack: "total",
          barMaxWidth: 14,
          data: passed,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "rgba(239,68,68,0.25)" },
              { offset: 1, color: "rgba(239,68,68,0.55)" },
            ]),
            borderRadius: [0, 3, 3, 0],
          },
          emphasis: { itemStyle: { color: "rgba(239,68,68,0.70)" } },
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(15,23,42,0.95)",
        borderColor: "rgba(255,255,255,0.08)",
        textStyle: { color: "#e2e8f0", fontSize: 11 },
        formatter: (params: echarts.TooltipComponentFormatterCallbackParams) => {
          if (!Array.isArray(params)) return "";
          const [b, p] = params as { value: number; seriesName: string }[];
          const total = (b?.value ?? 0) + (p?.value ?? 0);
          const rate  = total > 0 ? Math.round(((b?.value ?? 0) / total) * 100) : 0;
          return `<div style="font-weight:600;margin-bottom:6px">${(params[0] as any)?.axisValue}</div>
            <div>Blocked: <b style="color:#4ade80">${(b?.value ?? 0).toLocaleString()}</b></div>
            <div>Passed: <b style="color:#f87171">${(p?.value ?? 0).toLocaleString()}</b></div>
            <div style="margin-top:4px;color:#94a3b8">Block rate: <b style="color:#38bdf8">${rate}%</b></div>`;
        },
      },
      legend: {
        bottom: 0,
        textStyle: { color: "#64748b", fontSize: 10 },
        itemWidth: 10,
        itemHeight: 8,
        data: [
          { name: "Blocked", itemStyle: { color: "rgba(34,197,94,0.50)" } },
          { name: "Passed",  itemStyle: { color: "rgba(239,68,68,0.50)" } },
        ],
      },
    });

    const resize = () => chart.resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      chart.dispose();
    };
  }, [data]);

  return (
    <Card className="border border-border/50 shadow-xs gap-0 py-0">
      <CardHeader className="gap-0 px-5 pt-5 pb-3">
        <CardTitle className="text-sm">Attacks by Country</CardTitle>
        <CardDescription className="text-xs mt-0.5">
          Top 10 origin countries — blocked vs. passed
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground/30 hover:text-foreground"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-3 pb-4">
        {loading ? (
          <Skeleton className="w-full h-72 rounded-lg" />
        ) : (
          <div ref={chartRef} style={{ height: "320px", width: "100%" }} />
        )}
      </CardContent>
    </Card>
  );
};

export default AttackByCountryChart;
