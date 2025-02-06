"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import type { ChartConfiguration } from "chart.js";
import { Activity } from "@prisma/client";

interface ActivityChartProps {
  activities: Activity[];
}

export function ActivityChart({ activities }: ActivityChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !activities.length) return;

    // Clean up previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const getLast7Days = () => {
      return [...Array(7)]
        .map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split("T")[0];
        })
        .reverse();
    };

    const getDailyActivityCount = (dates: string[]) => {
      return dates.map((date) => ({
        date,
        count: activities.filter(
          (activity) =>
            new Date(activity.createdAt).toISOString().split("T")[0] === date
        ).length,
      }));
    };

    const last7Days = getLast7Days();
    const dailyActivityCount = getDailyActivityCount(last7Days);

    const chartConfig: ChartConfiguration = {
      type: "line",
      data: {
        labels: dailyActivityCount.map((d) =>
          new Date(d.date).toLocaleDateString()
        ),
        datasets: [
          {
            label: "Activities",
            data: dailyActivityCount.map((d) => d.count),
            fill: true,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Activity Trends",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    };

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, chartConfig);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [activities]);

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow">
      <canvas ref={chartRef} />
    </div>
  );
}
