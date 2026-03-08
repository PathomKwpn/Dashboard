import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface BarChartProps {
  title?: string;
  xAxisData: string[];
  seriesData: Array<{
    name: string;
    data: number[];
    color?: string;
  }>;
  height?: string;
}

const PALETTE = ["#6366f1", "#a5b4fc", "#818cf8"];

const BarChart = ({
  title,
  xAxisData,
  seriesData,
  height = "400px",
}: BarChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const isDark = document.documentElement.classList.contains("dark");
    const textColor = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)";
    const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

    const chart = echarts.init(chartRef.current);

    const option: echarts.EChartsOption = {
      title: title
        ? {
            text: title,
            textStyle: { fontSize: 13, fontWeight: 600, color: textColor },
          }
        : undefined,
      tooltip: {
        trigger: "axis",
        backgroundColor: isDark ? "#1e1e2e" : "#fff",
        borderColor,
        borderWidth: 1,
        textStyle: { color: isDark ? "#e2e8f0" : "#334155", fontSize: 12 },
        axisPointer: {
          type: "shadow",
          shadowStyle: { color: "rgba(99,102,241,0.04)" },
        },
      },
      legend: {
        data: seriesData.map((s) => s.name),
        bottom: 0,
        textStyle: { color: textColor, fontSize: 11 },
        icon: "roundRect",
        itemWidth: 12,
        itemHeight: 3,
        itemGap: 16,
      },
      grid: {
        left: 12,
        right: 16,
        bottom: 36,
        top: title ? 40 : 16,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: textColor, fontSize: 10, margin: 12 },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: borderColor, type: "dashed" } },
        axisLabel: { color: textColor, fontSize: 10 },
      },
      series: seriesData.map((s, i) => ({
        name: s.name,
        data: s.data,
        type: "bar" as const,
        barMaxWidth: 28,
        itemStyle: {
          borderRadius: [3, 3, 0, 0],
          color: s.color || PALETTE[i % PALETTE.length],
        },
      })),
      animationDuration: 600,
      animationEasing: "cubicOut",
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [title, xAxisData, seriesData]);

  return <div ref={chartRef} style={{ width: "100%", height }} />;
};

export default BarChart;
