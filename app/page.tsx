"use client";

import { useState, useEffect } from "react";
import { fetchCourseData } from "@/lib/data";
import CourseChart from "@/components/course-chart";
import SearchForm from "@/components/search-form";
import CourseList from "@/components/course-list";
import type { Course } from "@/types/course";
import Link from "next/link";
import {
  Star,
  Clock,
  Heart,
  Search,
  BarChart3,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#A51C30]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#A51C30]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#A51C30] to-[#8B1538] rounded-full mb-8 shadow-2xl animate-bounce-slow">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-[#A51C30] via-[#8B1538] to-[#A51C30] bg-clip-text text-transparent mb-6 animate-slide-up">
            HKS Course Viewer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-up-delay">
            Discover and explore Harvard Kennedy School courses with detailed
            insights and ratings
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-[#A51C30]"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-[#A51C30]/20"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-xl shadow-lg animate-slide-up">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Main Content */}
            <div className="space-y-8 mb-12">
              {/* Search Section */}
              <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-slide-up">
                <div className="bg-gradient-to-r from-[#A51C30] to-[#8B1538] p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                  <div className="relative flex items-center">
                    <Search className="h-6 w-6 text-white mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <h2 className="text-xl font-bold text-white">
                      Search Courses
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <SearchForm onSearch={handleSearch} courses={courses} />
                </div>
              </div>

              {/* Chart Section */}
              <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-slide-up-delay">
                <div className="bg-gradient-to-r from-[#A51C30] to-[#8B1538] p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                  <div className="relative flex items-center">
                    <BarChart3 className="h-8 w-8 text-white mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <h2 className="text-2xl font-bold text-white">
                      Rating & Workload
                    </h2>
                  </div>
                </div>
                <div className="p-8">
                  <CourseChart courses={filteredCourses} />
                </div>
              </div>
            </div>

            {/* Course List Section */}
            <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-slide-up-delay-2">
              <div className="bg-gradient-to-r from-[#A51C30] to-[#8B1538] p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="relative flex justify-between items-center">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-white mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <h2 className="text-2xl font-bold text-white">
                      Courses ({filteredCourses.length})
                    </h2>
                  </div>
                  <Link
                    href="/favorite"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all duration-300 border border-white/30 hover:scale-105">
                    <Heart className="h-6 w-6" />
                    <span className="font-semibold">Favorites</span>
                  </Link>
                </div>
              </div>
              <div className="p-8">
                <CourseList courses={filteredCourses} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
