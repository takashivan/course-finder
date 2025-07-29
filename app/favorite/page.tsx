"use client";

import { useState, useEffect } from "react";
import type { Course } from "@/types/course";
import { useFavorites } from "@/hooks/use-favorite";
import CourseList from "@/components/course-list";
import WeeklySchedule from "@/components/weeklyschedule";
import { fetchCourseData } from "@/lib/data";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FavoritesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [favoriteCourses, setFavoriteCourses] = useState<Course[]>([]);
  const { favorites } = useFavorites();

  useEffect(() => {
    const loadCourses = async () => {
      const allCourses = await fetchCourseData();
      setCourses(allCourses);
    };
    loadCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) => favorites.includes(course.id));
    setFavoriteCourses(filtered);
  }, [favorites, courses]);

  // 春期のコースをフィルタリング
  const springCourses = favoriteCourses.filter(
    (course) => course.term === "Spring" || course.term === "Full"
  );

  // 秋期のコースをフィルタリング
  const fallCourses = favoriteCourses.filter(
    (course) => course.term === "Fall" || course.term === "Full"
  );

  // その他のコースをフィルタリング
  const otherCourses = favoriteCourses.filter(
    (course) =>
      course.term !== "Spring" &&
      course.term !== "Fall" &&
      course.term !== "Full"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link
          href="/"
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">Favorite Courses</h1>
      </div>

      <Tabs defaultValue="spring">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spring">Spring</TabsTrigger>
          <TabsTrigger value="fall">Fall</TabsTrigger>
          <TabsTrigger value="other">Others</TabsTrigger>
        </TabsList>

        {/* 春学期 */}
        <TabsContent value="spring">
          <Tabs defaultValue="spring-list">
            <TabsList className="grid w-full grid-cols-2 my-4">
              <TabsTrigger value="spring-list">List</TabsTrigger>
              <TabsTrigger value="spring-schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="spring-list">
              {springCourses.length > 0 ? (
                <CourseList courses={springCourses} />
              ) : (
                <p className="text-center text-gray-500">No Fav Yet</p>
              )}
            </TabsContent>

            <TabsContent value="spring-schedule">
              {springCourses.length > 0 ? (
                <WeeklySchedule courses={springCourses} />
              ) : (
                <p className="text-center text-gray-500">No Fav Yet</p>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* 秋学期 */}
        <TabsContent value="fall">
          <Tabs defaultValue="fall-list">
            <TabsList className="grid w-full grid-cols-2 my-4">
              <TabsTrigger value="fall-list">List</TabsTrigger>
              <TabsTrigger value="fall-schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="fall-list">
              {fallCourses.length > 0 ? (
                <CourseList courses={fallCourses} />
              ) : (
                <p className="text-center text-gray-500">No Fav Yet</p>
              )}
            </TabsContent>

            <TabsContent value="fall-schedule">
              {fallCourses.length > 0 ? (
                <WeeklySchedule courses={fallCourses} />
              ) : (
                <p className="text-center text-gray-500">No Fav Yet</p>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* その他 */}
        <TabsContent value="other">
          {otherCourses.length > 0 ? (
            <CourseList courses={otherCourses} />
          ) : (
            <p className="text-center text-gray-500">No Fav Yet</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
