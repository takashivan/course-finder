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
  const [viewMode, setViewMode] = useState<"list" | "schedule">("list");
  const { favorites } = useFavorites();

  // デバッグ情報
  console.log("View mode:", viewMode);
  console.log("Favorites:", favorites);
  console.log("All courses:", courses.length);
  console.log("Favorite courses:", favoriteCourses.length);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        console.log("Loading courses...");
        const allCourses = await fetchCourseData();
        console.log("Loaded courses:", allCourses.length);
        console.log("Sample course:", allCourses[0]);
        setCourses(allCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) => favorites.includes(course.id));
    console.log("Filtering courses...");
    console.log("Courses count:", courses.length);
    console.log("Favorites count:", favorites.length);
    console.log("Filtered count:", filtered.length);

    // 簡単なデバッグ情報
    if (courses.length > 0 && favorites.length > 0) {
      console.log("Sample course ID:", courses[0].id);
      console.log("Sample favorite ID:", favorites[0]);
      console.log("Types match:", typeof courses[0].id === typeof favorites[0]);
    }

    setFavoriteCourses(filtered);
  }, [favorites, courses]);

  // // お気に入りコースの詳細情報をログ出力
  // favoriteCourses.forEach((course, index) => {
  //   console.log(`Favorite course ${index + 1}:`, {
  //     id: course.id,
  //     name: course.name,
  //     semester: course.semester,
  //     term: course.term,
  //     department: course.department,
  //   });
  // });

  // セメスター別にコースを分類
  const coursesBySemester = favoriteCourses.reduce((acc, course) => {
    const semester = course.semester || "Other";
    if (!acc[semester]) {
      acc[semester] = [];
    }
    acc[semester].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  console.log("Courses by semester:", coursesBySemester);

  // SpringコースをSpring1/Spring2に分類
  const getSpringCourses = (semester: string) => {
    const springCourses = coursesBySemester[semester] || [];
    const spring1 = springCourses.filter(
      (course) => course.term === "Spring 1" || course.term === "Full Term"
    );
    const spring2 = springCourses.filter(
      (course) => course.term === "Spring 2" || course.term === "Full Term"
    );
    return { spring1, spring2 };
  };

  // FallコースをFall1/Fall2に分類
  const getFallCourses = (semester: string) => {
    const fallCourses = coursesBySemester[semester] || [];
    const fall1 = fallCourses.filter(
      (course) => course.term === "FALL 1" || course.term === "Full Term"
    );
    const fall2 = fallCourses.filter(
      (course) => course.term === "FALL 2" || course.term === "Full Term"
    );
    return { fall1, fall2 };
  };

  // 利用可能なセメスターを取得
  const availableSemesters = Object.keys(coursesBySemester);
  const defaultSemester =
    availableSemesters.length > 0 ? availableSemesters[0] : "spring";

  // すべてのセメスターのリスト（お気に入りがなくても表示）
  const allSemesters = ["Spring", "Fall", "January"];
  const defaultSemesterForDisplay = allSemesters[0];

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

      {/* デバッグ情報表示 */}

      {/* リスト/スケジュール切り替えを上部に配置 */}
      <div className="mb-6 flex justify-center">
        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "list" | "schedule")}>
          <TabsList className="grid w-32 grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs defaultValue={defaultSemesterForDisplay}>
        <TabsList className="grid w-full grid-cols-3">
          {allSemesters.map((semester) => (
            <TabsTrigger key={semester} value={semester}>
              {semester === "January" ? "January" : semester}
            </TabsTrigger>
          ))}
        </TabsList>

        {allSemesters.map((semester) => {
          if (semester === "Spring") {
            const { spring1, spring2 } = getSpringCourses(semester);
            return (
              <TabsContent key={semester} value={semester}>
                <Tabs defaultValue="spring1">
                  <TabsList className="grid w-full grid-cols-2 my-4">
                    <TabsTrigger value="spring1">Spring1</TabsTrigger>
                    <TabsTrigger value="spring2">Spring2</TabsTrigger>
                  </TabsList>

                  <TabsContent value="spring1">
                    <div>
                      <p>View mode: {viewMode}</p>
                      <p>Spring1 courses: {spring1.length}</p>
                      {viewMode === "list" ? (
                        <div>
                          <p>Showing List</p>
                          {spring1.length > 0 ? (
                            <CourseList courses={spring1} />
                          ) : (
                            <p className="text-center text-gray-500">
                              No Fav Yet
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p>Showing Schedule</p>
                          {spring1.length > 0 ? (
                            <WeeklySchedule courses={spring1} />
                          ) : (
                            <p className="text-center text-gray-500">
                              No Fav Yet
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="spring2">
                    {viewMode === "list" ? (
                      spring2.length > 0 ? (
                        <CourseList courses={spring2} />
                      ) : (
                        <p className="text-center text-gray-500">No Fav Yet</p>
                      )
                    ) : spring2.length > 0 ? (
                      <WeeklySchedule courses={spring2} />
                    ) : (
                      <p className="text-center text-gray-500">No Fav Yet</p>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>
            );
          } else if (semester === "Fall") {
            const { fall1, fall2 } = getFallCourses(semester);
            return (
              <TabsContent key={semester} value={semester}>
                <Tabs defaultValue="fall1">
                  <TabsList className="grid w-full grid-cols-2 my-4">
                    <TabsTrigger value="fall1">Fall1</TabsTrigger>
                    <TabsTrigger value="fall2">Fall2</TabsTrigger>
                  </TabsList>

                  <TabsContent value="fall1">
                    {viewMode === "list" ? (
                      fall1.length > 0 ? (
                        <CourseList courses={fall1} />
                      ) : (
                        <p className="text-center text-gray-500">No Fav Yet</p>
                      )
                    ) : fall1.length > 0 ? (
                      <WeeklySchedule courses={fall1} />
                    ) : (
                      <p className="text-center text-gray-500">No Fav Yet</p>
                    )}
                  </TabsContent>

                  <TabsContent value="fall2">
                    {viewMode === "list" ? (
                      fall2.length > 0 ? (
                        <CourseList courses={fall2} />
                      ) : (
                        <p className="text-center text-gray-500">No Fav Yet</p>
                      )
                    ) : fall2.length > 0 ? (
                      <WeeklySchedule courses={fall2} />
                    ) : (
                      <p className="text-center text-gray-500">No Fav Yet</p>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>
            );
          } else {
            // January（その他）の場合は直接List/Scheduleを表示
            const otherCourses = coursesBySemester[semester] || [];
            return (
              <TabsContent key={semester} value={semester}>
                {viewMode === "list" ? (
                  otherCourses.length > 0 ? (
                    <CourseList courses={otherCourses} />
                  ) : (
                    <p className="text-center text-gray-500">No Fav Yet</p>
                  )
                ) : otherCourses.length > 0 ? (
                  <WeeklySchedule courses={otherCourses} />
                ) : (
                  <p className="text-center text-gray-500">No Fav Yet</p>
                )}
              </TabsContent>
            );
          }
        })}
      </Tabs>
    </div>
  );
}
