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
  const { favorites } = useFavorites();
  const [favoriteCourses, setFavoriteCourses] = useState<Course[]>([]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">お気に入りの講座</h1>

      <Tabs defaultValue="list">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">リスト</TabsTrigger>
          <TabsTrigger value="schedule">週間スケジュール</TabsTrigger>
          <TabsTrigger value="calendar">カレンダー</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {favoriteCourses.length > 0 ? (
            <CourseList courses={favoriteCourses} />
          ) : (
            <p className="text-center text-gray-500">
              お気に入りの講座はまだありません
            </p>
          )}
        </TabsContent>

        <TabsContent value="schedule">
          {favoriteCourses.length > 0 ? (
            <WeeklySchedule courses={favoriteCourses} />
          ) : (
            <p className="text-center text-gray-500">
              お気に入りの講座はまだありません
            </p>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          {/* カレンダーコンポーネントがあれば */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
