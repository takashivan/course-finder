export interface Course {
  id: string;
  name: string;
  instructor: string;
  semester: string;
  term: string;
  department: string;
  rating: number;
  workload: number;
  days: string;
  time: string;
  japaneseComments?: string;
  instructorRating: number;
  coursePedagogyImage: string;
  instructorRatingImage: string;
}
