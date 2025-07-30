export interface Course {
  id: string;
  course_id: string;
  name: string;
  instructor: string;
  term: string;
  department: string;
  rating: number;
  workload: number;
  days: string;
  semester: string;
  time: string;
  japaneseComments?: string;
  instructorRating: number;
  coursePedagogyImage: string;
  instructorRatingImage: string;
}
