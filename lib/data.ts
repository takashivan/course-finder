import Papa from "papaparse";
import type { Course } from "@/types/course";

export async function fetchCourseData(): Promise<Course[]> {
  return new Promise((resolve, reject) => {
    // スプレッドシートのCSV公開URL
    const csvUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTNFLZxlAApsT-hKWWwWahj0dEQkf0XkqsRHisJaM3H4oYwtH6JL1ocClf5SLtgX2d7MKJJnTsPs9j/pub?output=csv";

    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        // デバッグ: CSVの列名を確認
        if (results.data.length > 0) {
          const firstRow = results.data[0] as any;
          console.log("CSV headers:", Object.keys(firstRow));
          console.log("Sample row:", firstRow);
        }

        // 型アサーションを使用
        const courses = results.data
          .filter((row: any) => row.id) // 空行や不完全な行を除外
          .map((row: any) => {
            // デバッグ: 最初の行のマッピングを確認
            if (row.id === "1") {
              console.log("Mapping row with id 1:");
              console.log("Raw coursePedagogyImage:", row.coursePedagogyImage);
              console.log(
                "Raw instructorRatingImage:",
                row.instructorRatingImage
              );
            }

            // 明示的な型キャスト
            const course = {
              id: String(row.id || ""),
              name: String(row.name || ""),
              instructor: String(row.instructor || ""),
              term: String(row.term || ""),
              semester: String(row.semester || ""),
              department: String(row.department || ""),
              rating:
                row.rating !== undefined && row.rating !== null
                  ? Number(row.rating)
                  : null,
              workload:
                row.workload !== undefined && row.workload !== null
                  ? Number(row.workload)
                  : null,
              days: String(row.days || ""),
              time: String(row.time || ""),
              japaneseComments: String(row.japaneseComments || ""),
              course_id: String(row.course_id || ""),
              instructorRating:
                row.instructorRating !== undefined &&
                row.instructorRating !== null
                  ? Number(row.instructorRating)
                  : null,
              coursePedagogyImage: String(row.coursePedagogyImage || ""),
              instructorRatingImage: String(row.instructorRatingImage || ""),
            } as Course;

            // デバッグ: マッピング後の値を確認
            if (course.id === "1") {
              console.log("Mapped course with id 1:");
              console.log(
                "Mapped coursePedagogyImage:",
                course.coursePedagogyImage
              );
              console.log(
                "Mapped instructorRatingImage:",
                course.instructorRatingImage
              );
            }

            return course;
          }) as Course[];

        resolve(courses);
      },
      error: (error) => {
        console.error("データ取得エラー:", error);
        reject(error);
      },
    });
  });
}

// 型ガード関数を追加
function isCourse(obj: any): obj is Course {
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.instructor === "string" &&
    typeof obj.term === "string" &&
    typeof obj.department === "string" &&
    (obj.rating === null || typeof obj.rating === "number") &&
    (obj.workload === null || typeof obj.workload === "number") &&
    typeof obj.days === "string" &&
    typeof obj.time === "string" &&
    typeof obj.japaneseComments === "string"
  );
}
// 学部のリストを取得する関数
export function getDepartments(courses: Course[]): string[] {
  const departments = new Set(
    courses
      .map((course) => course.department)
      .filter((dept) => dept && dept.trim() !== "")
  );
  return Array.from(departments).sort();
}

// 学期のリストを取得する関数
export function getTerms(courses: Course[]): string[] {
  const terms = new Set(
    courses
      .map((course) => course.term)
      .filter((term) => term && term.trim() !== "")
  );
  return Array.from(terms).sort();
}
export function getSemesters(courses: Course[]): string[] {
  const semesters = new Set(
    courses
      .map((course) => course.semester)
      .filter((semester) => semester && semester.trim() !== "")
  );
  return Array.from(semesters).sort();
}
