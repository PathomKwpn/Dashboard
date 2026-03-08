import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface PieChartProps {
  title?: string;
  data: Array<{
    name: string;
    value: number;
    itemStyle?: { color: string };
  }>;
  height?: string;
  centerLabel?: string;
}

const PieChart = ({
  title,
  data,
  height = "400px",
  centerLabel,
}: PieChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const isDark = document.documentElement.classList.contains("dark");
    const textColor = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)";
    const total = data.reduce((s, d) => s + d.value, 0);

    const chart = echarts.init(chartRef.current);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
        backgroundColor: isDark ? "#1e1e2e" : "#fff",
        borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        borderWidth: 1,
        textStyle: { color: isDark ? "#e2e8f0" : "#334155", fontSize: 12 },
        formatter: (params: unknown) => {
          const p = params as {
            name: string;
            value: number;
            percent: number;
            marker: string;
          };
          return `${p.marker} ${p.name}<br/><b>${p.value.toLocaleString()}</b> (${p.percent}%)`;
        },
      },
      series: [
        {
          name: title || "Data",
          type: "pie",
          radius: ["52%", "78%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: isDark ? "#1a1a2e" : "#ffffff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "center",
            formatter: () =>
              centerLabel
                ? `{val|${total.toLocaleString()}}\n{lbl|${centerLabel}}`
                : "",
            rich: {
              val: {
                fontSize: 18,
                fontWeight: 700,
                color: isDark ? "#e2e8f0" : "#1e293b",
                padding: [0, 0, 4, 0],
              },
              lbl: {
                fontSize: 10,
                color: textColor,
                fontWeight: 500,
              },
            },
          },
          emphasis: {
            scale: true,
            scaleSize: 4,
            itemStyle: { shadowBlur: 8, shadowColor: "rgba(0,0,0,0.12)" },
          },
          data,
        },
      ],
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
  }, [title, data, centerLabel]);

  return <div ref={chartRef} style={{ width: "100%", height }} />;
};

export default PieChart;
