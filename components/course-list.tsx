"use client";

import { useState } from "react";
import type { Course } from "@/types/course";
import { useFavorites } from "@/hooks/use-favorite";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Star,
  Clock,
  Heart,
  Info,
  BookOpen,
  User,
  Calendar,
  Clock as ClockIcon,
} from "lucide-react";
import CourseDialog from "./course-dialog";

interface CourseListProps {
  courses: Course[];
}

export default function CourseList({ courses }: CourseListProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#A51C30]/5 to-[#8B1538]/5 p-4 rounded-xl border border-[#A51C30]/10">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-[#A51C30]/10 rounded-lg">
            <BookOpen className="h-5 w-5 text-[#A51C30]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Average Rating</p>
            <p className="text-lg font-bold text-gray-900">
              {(
                courses.reduce((sum, course) => sum + course.rating, 0) /
                courses.length
              ).toFixed(1)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Avg Workload</p>
            <p className="text-lg font-bold text-gray-900">
              {(
                courses.reduce((sum, course) => sum + course.workload, 0) /
                courses.length
              ).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#A51C30] to-[#8B1538] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-white" />
              <h3 className="text-lg font-bold text-white">Course List</h3>
            </div>
            <div className="flex items-center space-x-2 text-white/80 text-sm">
              <Star className="h-4 w-4" />
              <span>Rating</span>
              <span className="mx-2">•</span>
              <Clock className="h-4 w-4" />
              <span>Workload</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-16 text-center">FAV</TableHead>
                <TableHead className="font-semibold text-[#A51C30]">
                  Course ID
                </TableHead>
                <TableHead className="font-semibold text-[#A51C30]">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-[#A51C30]">
                  Instructor
                </TableHead>
                <TableHead className="font-semibold text-[#A51C30]">
                  Department
                </TableHead>
                <TableHead className="font-semibold text-[#A51C30]">
                  Schedule
                </TableHead>
                <TableHead className="text-center font-semibold text-[#A51C30]">
                  Rating
                </TableHead>
                <TableHead className="text-center font-semibold text-[#A51C30]">
                  Workload
                </TableHead>
                <TableHead className="w-16 text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        該当する講座がありません
                      </p>
                      <p className="text-sm text-gray-400">
                        検索条件を変更してみてください
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course, index) => (
                  <TableRow
                    key={course.id}
                    className="hover:bg-gradient-to-r hover:from-[#A51C30]/5 hover:to-[#8B1538]/5 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleCourseClick(course)}>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(course.id);
                        }}
                        className="group-hover:scale-110 transition-transform duration-200">
                        <Heart
                          className={`w-5 h-5 transition-all duration-200 ${
                            isFavorite(course.id)
                              ? "text-red-500 fill-red-500 scale-110"
                              : "text-gray-400 group-hover:text-red-400"
                          }`}
                        />
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium text-gray-700">
                      {course.course_id}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="group-hover:text-[#A51C30] transition-colors duration-200">
                        <p className="font-medium text-gray-900 line-clamp-2">
                          {course.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">
                          {course.instructor}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#A51C30]/10 text-[#A51C30]">
                        {course.department}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {course.days}
                        </span>
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {course.time}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-gray-900">
                          {course.rating.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-gray-900">
                          {course.workload.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourseClick(course);
                        }}
                        className="group-hover:scale-110 transition-transform duration-200">
                        <Info className="w-4 h-4 text-gray-500 group-hover:text-[#A51C30]" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
