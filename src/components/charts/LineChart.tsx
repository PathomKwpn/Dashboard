import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

interface LineChartProps {
  title?: string;
  xAxisData: string[];
  seriesData: Array<{
    name: string;
    data: number[];
    type?: string;
    smooth?: boolean;
    color?: string;
    areaColor?: [string, string];
  }>;
  height?: string;
}

const PALETTE = ["#6366f1", "#a5b4fc"];

const LineChart = ({
  title,
  xAxisData,
  seriesData,
  height = "400px",
}: LineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  /* Track theme changes */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const textColor   = isDark ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.50)";
    const gridColor   = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
    const pointerColor = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)";
    const tooltipBg   = isDark ? "#1c1d1f" : "#ffffff";
    const tooltipText = isDark ? "#d1d5db" : "#374151";

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
        backgroundColor: tooltipBg,
        borderColor: gridColor,
        borderWidth: 1,
        textStyle: { color: tooltipText, fontSize: 12 },
        axisPointer: {
          lineStyle: { color: pointerColor, type: "dashed" },
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
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: textColor, fontSize: 10, margin: 12 },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: gridColor, type: "dashed" } },
        axisLabel: { color: textColor, fontSize: 10 },
      },
      series: seriesData.map((s, i) => {
        const color = s.color || PALETTE[i % PALETTE.length];
        return {
          name: s.name,
          data: s.data,
          type: (s.type as "line") || "line",
          smooth: s.smooth !== undefined ? s.smooth : true,
          symbol: "none",
          lineStyle: { width: i === 0 ? 2 : 1.5, color },
          itemStyle: { color },
          areaStyle:
            i === 0
              ? {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: s.areaColor?.[0] ?? `${color}30` },
                    { offset: 1, color: s.areaColor?.[1] ?? `${color}05` },
                  ]),
                }
              : undefined,
        };
      }),
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
  }, [title, xAxisData, seriesData, isDark]);

  return <div ref={chartRef} style={{ width: "100%", height }} />;
};

export default LineChart;
