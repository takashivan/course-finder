"use client";

import type { Course } from "@/types/course";
import { useFavorites } from "@/hooks/use-favorite";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Clock, Heart } from "lucide-react";

interface CourseDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CourseDialog({
  course,
  open,
  onOpenChange,
}: CourseDialogProps) {
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!course) return null;

  // デバッグ情報
  console.log("Course dialog data:", {
    coursePedagogyImage: course.coursePedagogyImage,
    instructorRatingImage: course.instructorRatingImage,
    hasCoursePedagogy: !!course.coursePedagogyImage,
    hasInstructorRating: !!course.instructorRatingImage,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{course.name}</DialogTitle>
              <DialogDescription>
                {course.id} - {course.department}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(course.id)}>
              <Heart
                className={`w-5 h-5 ${
                  isFavorite(course.id)
                    ? "text-red-500 fill-red-500"
                    : "text-gray-500"
                }`}
              />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">instructor</p>
              <p className="text-sm">{course.instructor}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">semester</p>
              <p className="text-sm">{course.semester}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">term</p>
              <p className="text-sm">{course.term}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">days</p>
              <p className="text-sm">{course.days}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">time</p>
              <p className="text-sm">{course.time}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1 bg-gray-100 p-3 rounded-md text-center">
              <div className="flex items-center justify-center mb-1">
                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                <span className="font-bold text-lg">
                  {course.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-gray-500">Rating</p>
            </div>

            <div className="flex-1 bg-gray-100 p-3 rounded-md text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-5 h-5 text-blue-500 mr-1" />
                <span className="font-bold text-lg">
                  {course.workload.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-gray-500">Workload</p>
            </div>
          </div>

          {course.coursePedagogyImage &&
            course.coursePedagogyImage.trim() !== "" && (
              <div className="mt-4 space-y-1">
                <p className="text-sm font-medium">Course Pedagogy</p>
                <div className="flex items-center justify-center">
                  <img
                    src={course.coursePedagogyImage}
                    alt="Course Pedagogy"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

          {course.instructorRatingImage &&
            course.instructorRatingImage.trim() !== "" && (
              <div className="mt-4 space-y-1">
                <p className="text-sm font-medium">Instructor Rating</p>
                <div className="flex items-center justify-center">
                  <img
                    src={course.instructorRatingImage}
                    alt="Instructor Rating"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          {course.japaneseComments && (
            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium">コメント</p>
              <div className="bg-gray-50 p-3 rounded-md text-sm h-40 overflow-y-scroll">
                {course.japaneseComments}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
