import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface LineChartProps {
  title?: string;
  xAxisData: string[];
  seriesData: Array<{
    name: string;
    data: number[];
    type?: string;
    smooth?: boolean;
  }>;
  height?: string;
}

const LineChart = ({
  title,
  xAxisData,
  seriesData,
  height = "400px",
}: LineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      title: title ? { text: title } : undefined,
      tooltip: {
        trigger: "axis",
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
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
      },
      series: seriesData.map((s) => ({
        name: s.name,
        data: s.data,
        type: s.type || "line",
        smooth: s.smooth !== undefined ? s.smooth : true,
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

export default LineChart;
