"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { getDepartments, getTerms, getSemesters } from "@/lib/data";
import type { Course } from "@/types/course";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";

interface SearchFormProps {
  onSearch: (params: any) => void;
  courses: Course[];
}

export default function SearchForm({ onSearch, courses }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [term, setTerm] = useState("");
  const [semester, setSemester] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [terms, setTerms] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);

  useEffect(() => {
    if (courses.length > 0) {
      setDepartments(getDepartments(courses));
      setTerms(getTerms(courses));
      setSemesters(getSemesters(courses));
    }
  }, [courses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // "all"が選択された場合は、そのフィルターを無視
    const searchParams = {
      query,
      department: department === "all" ? "" : department,
      term: term === "all" ? "" : term,
      semester: semesters.length > 0 ? semesters : "",
    };

    onSearch(searchParams);
  };

  const handleReset = () => {
    setQuery("");
    setDepartment("");
    setTerm("");
    setSemester("");
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Keywords - Full width on mobile */}
      <div className="space-y-2">
        <Label htmlFor="query" className="text-xs text-gray-600">
          Keywords
        </Label>
        <Input
          id="query"
          type="text"
          placeholder="Course name, instructor, comments..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10"
        />
      </div>

      {/* Filters - Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department" className="text-xs text-gray-600">
            Section
          </Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger id="department" className="h-10">
              <SelectValue placeholder="All Sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Semester */}
        <div className="space-y-2">
          <Label htmlFor="semester" className="text-xs text-gray-600">
            Semester
          </Label>
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger id="semester" className="h-10">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {semesters.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Term */}
        <div className="space-y-2">
          <Label htmlFor="term" className="text-xs text-gray-600">
            Term
          </Label>
          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger id="term" className="h-10">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {terms.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons - Full width on mobile */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="submit" size="sm" className="h-10 flex-1">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="h-10 flex-1 sm:flex-none sm:px-6">
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </form>
  );
}
