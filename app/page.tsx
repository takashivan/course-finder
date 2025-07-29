"use client";

import { useState, useEffect } from "react";
import { fetchCourseData } from "@/lib/data";
import CourseChart from "@/components/course-chart";
import SearchForm from "@/components/search-form";
import CourseList from "@/components/course-list";
import type { Course } from "@/types/course";
import Link from "next/link";
import { Star, Clock, Heart } from "lucide-react";

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCourseData();
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        setError("データの読み込みに失敗しました。");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (searchParams: any) => {
    let results = [...courses];

    if (searchParams.query) {
      const query = searchParams.query.toLowerCase();
      results = results.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query) ||
          (course.japaneseComments &&
            course.japaneseComments.toLowerCase().includes(query))
      );
    }

    if (searchParams.department) {
      results = results.filter(
        (course) => course.department === searchParams.department
      );
    }

    if (searchParams.term) {
      results = results.filter((course) => course.term === searchParams.term);
    }

    setFilteredCourses(results);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        KCF Kennedy Course Finder
      </h1>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Search</h2>
              <SearchForm onSearch={handleSearch} courses={courses} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Rating / Workload</h2>
              <CourseChart courses={filteredCourses} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Courses ({filteredCourses.length}件)
              </h2>
              <Link
                href="/favorite"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5" />
                <span>FAVs</span>
              </Link>
            </div>
            <CourseList courses={filteredCourses} />
          </div>
        </>
      )}
    </main>
  );
}
