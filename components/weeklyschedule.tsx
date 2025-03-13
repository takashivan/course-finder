"use client";

import React from "react";
import type { Course } from "@/types/course";

const WeeklySchedule = ({ courses }: { courses: Course[] }) => {
  // 曜日と時間を整理
  const daysOrder = ["月", "火", "水", "木", "金", "土", "日"];

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="grid grid-cols-8 bg-gray-100 font-bold text-center">
        <div className="p-2 border-r">時間</div>
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
            // 該当する時間帯とその曜日の講座を検索
            const matchingCourses = courses.filter(
              (course) => course.days.includes(day) && course.time === timeSlot
            );

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
