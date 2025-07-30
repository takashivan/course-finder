"use client";

import React, { useState } from "react";
import type { Course } from "@/types/course";
import { useFavorites } from "@/hooks/use-favorite";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const WeeklySchedule = ({ courses }: { courses: Course[] }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
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
                    className="bg-blue-100 rounded p-1 mb-1 text-xs cursor-pointer hover:bg-blue-200"
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsDialogOpen(true);
                    }}>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedCourse && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>{selectedCourse.name}</DialogTitle>
                  <DialogDescription>
                    {selectedCourse.id} - {selectedCourse.department}
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(selectedCourse.id)}>
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite(selectedCourse.id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-500"
                    }`}
                  />
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">instructor</p>
                  <p className="text-sm">{selectedCourse.instructor}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">semester</p>
                  <p className="text-sm">{selectedCourse.term}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">term</p>
                  <p className="text-sm">{selectedCourse.term}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">days</p>
                  <p className="text-sm">{selectedCourse.days}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">time</p>
                  <p className="text-sm">{selectedCourse.time}</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1 bg-gray-100 p-3 rounded-md text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span className="font-bold text-lg">
                      {selectedCourse.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">評価</p>
                </div>

                <div className="flex-1 bg-gray-100 p-3 rounded-md text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-5 h-5 text-blue-500 mr-1" />
                    <span className="font-bold text-lg">
                      {selectedCourse.workload.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">作業量</p>
                </div>
              </div>

              {selectedCourse.japaneseComments && (
                <div className="mt-4 space-y-1">
                  <p className="text-sm font-medium">コメント</p>
                  <div className="bg-gray-50 p-3 rounded-md text-sm h-40 overflow-y-scroll">
                    {selectedCourse.japaneseComments}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default WeeklySchedule;
