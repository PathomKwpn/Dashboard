import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface BarChartProps {
  title?: string;
  xAxisData: string[];
  seriesData: Array<{
    name: string;
    data: number[];
  }>;
  height?: string;
}

const BarChart = ({
  title,
  xAxisData,
  seriesData,
  height = "400px",
}: BarChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      title: title ? { text: title } : undefined,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: seriesData.map((s) => s.name),
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: title ? "15%" : "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: {
        type: "value",
      },
      series: seriesData.map((s) => ({
        name: s.name,
        data: s.data,
        type: "bar",
      })),
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [title, xAxisData, seriesData]);

  return <div ref={chartRef} style={{ width: "100%", height }} />;
};

export default BarChart;
