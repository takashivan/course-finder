"use client";

import React from "react";
import type { Course } from "@/types/course";

const WeeklySchedule = ({ courses }: { courses: Course[] }) => {
  // 曜日の変換マップ
  const dayMap: { [key: string]: string } = {
    Mon: "Mon",
    Tue: "Tue",
    Wed: "Wed",
    Thu: "Thu",
    Fri: "Fri",
    Sat: "Sat",
    Sun: "Sun",
  };

  const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="grid grid-cols-8 bg-gray-100 font-bold text-center">
        <div className="p-2 border-r">Time</div>
        {daysOrder.map((day) => (
          <div key={day} className="p-2 border-r">
            {day}
          </div>
        ))}
      </div>

      {/* 時間帯 */}
      {[
        "08:30-10:00",
        "10:30-12:00",
        "13:00-14:30",
        "15:00-16:30",
        "17:00-18:30",
      ].map((timeSlot) => (
        <div key={timeSlot} className="grid grid-cols-8 text-center">
          <div className="p-2 border-r bg-gray-50">{timeSlot}</div>
          {daysOrder.map((day) => {
            const matchingCourses = courses.filter((course) => {
              // 曜日のマッチングロジック
              const courseDays = course.days.split(/[,、]\s*/).map((d) => {
                const trimmedDay = d.trim();
                return dayMap[trimmedDay] || trimmedDay;
              });

              return courseDays.includes(day);
            });

            return (
              <div
                key={day}
                className="p-2 border-r min-h-[80px] flex flex-col justify-center">
                {matchingCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-blue-100 rounded p-1 mb-1 text-xs">
                    {course.name}
                    <br />
                    {course.instructor}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WeeklySchedule;
