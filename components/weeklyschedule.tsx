"use client";

import React from "react";
import type { Course } from "@/types/course";
const WeeklySchedule = ({ courses }: { courses: Course[] }) => {
  // 時間を分に変換する関数
  const timeToMinutes = (timeStr: string) => {
    console.log("Converting time:", timeStr);

    // より柔軟な正規表現
    const match = timeStr.match(
      /(\d+):(\d+)\s*(am|pm)?\s*[-–]\s*(\d+):(\d+)\s*(am|pm)?/i
    );

    if (!match) {
      console.log("No match for time:", timeStr);
      return null;
    }

    const normalizeHour = (hour: string, period?: string) => {
      let h = parseInt(hour);
      period = period?.toLowerCase();

      if (period === "pm" && h !== 12) h += 12;
      if (period === "am" && h === 12) h = 0;

      return h;
    };

    const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] =
      match;

    const start =
      normalizeHour(startHour, startPeriod) * 60 + parseInt(startMin);
    const end = normalizeHour(endHour, endPeriod) * 60 + parseInt(endMin);

    console.log("Converted time:", { start, end });
    return { start, end };
  };

  // スケジュールスロットを分に変換する関数
  const slotToMinutes = (timeSlot: string) => {
    const [startTime, endTime] = timeSlot.split("-");
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;

    return { start, end };
  };

  // 時間が重なっているかチェックする関数
  const isTimeOverlapping = (courseTime: string, timeSlot: string) => {
    const course = timeToMinutes(courseTime);
    const slot = slotToMinutes(timeSlot);

    if (!course) return false;

    const overlapping =
      (course.start >= slot.start && course.start < slot.end) ||
      (course.end > slot.start && course.end <= slot.end) ||
      (course.start <= slot.start && course.end >= slot.end);

    console.log("Course time:", courseTime);
    console.log("Time slot:", timeSlot);
    console.log("Is overlapping:", overlapping);

    return overlapping;
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
            console.log(`Checking day: ${day}, timeSlot: ${timeSlot}`);

            const matchingCourses = courses.filter((course) => {
              // 曜日のマッチング
              const courseDays = course.days
                .split(/[,、]\s*/)
                .map((d) => d.trim());

              // デバッグログ
              console.log("Course:", course.name);
              console.log("Course days:", courseDays);
              console.log("Checking day:", day);
              console.log(
                "Day matches:",
                courseDays.some(
                  (courseDay) =>
                    courseDay === day ||
                    (courseDay === "Mon" && day === "Mon") ||
                    (courseDay === "Tue" && day === "Tue") ||
                    (courseDay === "Wed" && day === "Wed") ||
                    (courseDay === "Thu" && day === "Thu") ||
                    (courseDay === "Fri" && day === "Fri") ||
                    (courseDay === "Sat" && day === "Sat") ||
                    (courseDay === "Sun" && day === "Sun")
                )
              );

              const dayMatches = courseDays.some(
                (courseDay) =>
                  courseDay === day ||
                  (courseDay === "Mon" && day === "Mon") ||
                  (courseDay === "Tue" && day === "Tue") ||
                  (courseDay === "Wed" && day === "Wed") ||
                  (courseDay === "Thu" && day === "Thu") ||
                  (courseDay === "Fri" && day === "Fri") ||
                  (courseDay === "Sat" && day === "Sat") ||
                  (courseDay === "Sun" && day === "Sun")
              );

              const timeMatches = isTimeOverlapping(course.time, timeSlot);

              console.log("Time matches:", timeMatches);

              return dayMatches && timeMatches;
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
