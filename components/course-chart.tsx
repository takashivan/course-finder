"use client";

import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import type { Course } from "@/types/course";
import CourseDialog from "./course-dialog";
import { BarChart3, TrendingUp, Target, MousePointer } from "lucide-react";

Chart.register(...registerables);

interface CourseChartProps {
  courses: Course[];
}

export default function CourseChart({ courses }: CourseChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!chartRef.current) return;

    // 既存のチャートを破棄
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // データポイントの準備
    const data = courses.map((course) => ({
      x: course.workload,
      y: course.rating,
      course: course, // 講座の全データを保持
    }));

    // チャートの作成
    chartInstance.current = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Course Rating and Workload",
            data: data,
            backgroundColor: (context) => {
              const point = context.raw as any;
              const rating = point.y;
              const workload = point.x;

              // 評価が高く、作業量が低い場合は緑色
              if (rating >= 80 && workload <= 20) {
                return "rgba(34, 197, 94, 0.7)"; // green-500
              }
              // 評価が高い場合は黄色
              else if (rating >= 70) {
                return "rgba(234, 179, 8, 0.7)"; // yellow-500
              }
              // 作業量が高い場合は赤色
              else if (workload >= 80) {
                return "rgba(239, 68, 68, 0.7)"; // red-500
              }
              // デフォルトはハーバードカラー
              else {
                return "rgba(165, 28, 48, 0.7)"; // #A51C30
              }
            },
            borderColor: (context) => {
              const point = context.raw as any;
              const rating = point.y;
              const workload = point.x;

              if (rating >= 80 && workload <= 20) {
                return "rgba(34, 197, 94, 1)";
              } else if (rating >= 70) {
                return "rgba(234, 179, 8, 1)";
              } else if (workload >= 80) {
                return "rgba(239, 68, 68, 1)";
              } else {
                return "rgba(165, 28, 48, 1)";
              }
            },
            borderWidth: 2,
            pointRadius: 8,
            pointHoverRadius: 12,
            pointHoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "nearest",
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Workload (0 = Best)",
              font: {
                size: 14,
                weight: "bold",
              },
              padding: 10,
            },
            min: 1,
            max: 100,
            ticks: {
              stepSize: 20,
              font: {
                size: 12,
              },
            },
            grid: {
              color: "rgba(156, 163, 175, 0.2)",
              lineWidth: 1,
            },
          },
          y: {
            title: {
              display: true,
              text: "Rating (100 = Best)",
              font: {
                size: 14,
                weight: "bold",
              },
              padding: 10,
            },
            min: 1,
            max: 100,
            ticks: {
              stepSize: 20,
              font: {
                size: 12,
              },
            },
            grid: {
              color: "rgba(156, 163, 175, 0.2)",
              lineWidth: 1,
            },
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const dataIndex = elements[0].index;
            const courseData = data[dataIndex].course;
            setSelectedCourse(courseData);
            setIsDialogOpen(true);
          }
        },
        plugins: {
          tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.95)",
            titleColor: "#F9FAFB",
            bodyColor: "#D1D5DB",
            borderColor: "rgba(165, 28, 48, 0.3)",
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: (context) => {
                const point = context[0].raw as any;
                return point.course.name;
              },
              label: (context) => {
                const point = context.raw as any;
                return [
                  `Instructor: ${point.course.instructor}`,
                  `Department: ${point.course.department}`,
                  `Rating: ${point.y}/100`,
                  `Workload: ${point.x}/100`,
                ];
              },
            },
          },
          legend: {
            display: false,
          },
        },
      },
    });

    // クリーンアップ関数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [courses]);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedCourse(null);
  };

  // 統計データの計算
  const avgRating =
    courses.length > 0
      ? courses.reduce((sum, course) => sum + course.rating, 0) / courses.length
      : 0;
  const avgWorkload =
    courses.length > 0
      ? courses.reduce((sum, course) => sum + course.workload, 0) /
        courses.length
      : 0;
  const bestCourses = courses.filter(
    (course) => course.rating >= 80 && course.workload <= 20
  ).length;

  return (
    <div className="space-y-6">
      {/* Chart Header and Chart Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Header */}
        <div className="bg-gradient-to-r from-[#A51C30] to-[#8B1538] p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-white" />
              <h3 className="text-lg font-bold text-white">
                Rating & Workload Analysis
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-white/80 text-sm">
              <MousePointer className="h-4 w-4" />
              <span>Click points</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-300" />
                <span className="text-white/80 text-sm">Avg Rating</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {avgRating.toFixed(1)}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-300" />
                <span className="text-white/80 text-sm">Avg Workload</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {avgWorkload.toFixed(1)}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-green-400 rounded-full"></div>
                <span className="text-white/80 text-sm">Best Courses</span>
              </div>
              <p className="text-2xl font-bold text-white">{bestCourses}</p>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="w-full h-80">
            <canvas ref={chartRef}></canvas>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">High Rating, Low Workload</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">High Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">High Workload</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#A51C30] rounded-full"></div>
              <span className="text-gray-600">Standard</span>
            </div>
          </div>
        </div>
      </div>

      <CourseDialog
        course={selectedCourse}
        open={isDialogOpen}
        onOpenChange={closeDialog}
      />
    </div>
  );
}
