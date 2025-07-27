import type { Dayjs } from "dayjs";

export interface ICourseEntity {
  id: number;
  teacher_id: number;
  category_id: number;
  title: string;
  max_student: number;
  duration_hours: number;
  price: number;
  registration_start_date: string | Dayjs | null;
  registration_end_date: string | Dayjs | null;
  start_date: string | Dayjs | null;
  end_date: string | Dayjs | null;
  description: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  teacher?: ITeacher;
  category?: ICourseCategory;
}

export interface ITeacher {
  id: number;
  specialization: string;
  experience: number;
  education: string;
  created_at: string;
  updated_at: string;
}

export interface ICourseCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
