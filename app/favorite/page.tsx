"use client";

import { useState, useEffect } from "react";
import type { Course } from "@/types/course";
import { useFavorites } from "@/hooks/use-favorite";
import CourseList from "@/components/course-list";
import WeeklySchedule from "@/components/weeklyschedule";
import { fetchCourseData } from "@/lib/data";
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
      <h1 className="text-2xl font-bold mb-4">お気に入りの講座</h1>

      <Tabs defaultValue="spring">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spring">春学期</TabsTrigger>
          <TabsTrigger value="fall">秋学期</TabsTrigger>
          <TabsTrigger value="other">その他</TabsTrigger>
        </TabsList>

        {/* 春学期 */}
        <TabsContent value="spring">
          <Tabs defaultValue="spring-list">
            <TabsList className="grid w-full grid-cols-2 my-4">
              <TabsTrigger value="spring-list">リスト</TabsTrigger>
              <TabsTrigger value="spring-schedule">スケジュール</TabsTrigger>
            </TabsList>

            <TabsContent value="spring-list">
              {springCourses.length > 0 ? (
                <CourseList courses={springCourses} />
              ) : (
                <p className="text-center text-gray-500">
                  春学期のお気に入り講座はありません
                </p>
              )}
            </TabsContent>

            <TabsContent value="spring-schedule">
              {springCourses.length > 0 ? (
                <WeeklySchedule courses={springCourses} />
              ) : (
                <p className="text-center text-gray-500">
                  春学期のお気に入り講座はありません
                </p>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* 秋学期 */}
        <TabsContent value="fall">
          <Tabs defaultValue="fall-list">
            <TabsList className="grid w-full grid-cols-2 my-4">
              <TabsTrigger value="fall-list">リスト</TabsTrigger>
              <TabsTrigger value="fall-schedule">スケジュール</TabsTrigger>
            </TabsList>

            <TabsContent value="fall-list">
              {fallCourses.length > 0 ? (
                <CourseList courses={fallCourses} />
              ) : (
                <p className="text-center text-gray-500">
                  秋学期のお気に入り講座はありません
                </p>
              )}
            </TabsContent>

            <TabsContent value="fall-schedule">
              {fallCourses.length > 0 ? (
                <WeeklySchedule courses={fallCourses} />
              ) : (
                <p className="text-center text-gray-500">
                  秋学期のお気に入り講座はありません
                </p>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* その他 */}
        <TabsContent value="other">
          {otherCourses.length > 0 ? (
            <CourseList courses={otherCourses} />
          ) : (
            <p className="text-center text-gray-500">
              その他のお気に入り講座はありません
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
