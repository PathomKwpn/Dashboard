import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface PieChartProps {
  title?: string;
  data: Array<{
    name: string;
    value: number;
  }>;
  height?: string;
}

const PieChart = ({ title, data, height = "400px" }: PieChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      title: title ? { text: title, left: "center" } : undefined,
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: title || "Data",
          type: "pie",
          radius: "50%",
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
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
  }, [title, data]);

  return <div ref={chartRef} style={{ width: "100%", height }} />;
};

export default PieChart;
