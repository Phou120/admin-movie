import type { IPagination } from "../../../common/interface/pagination.interface";
import type { ICourseEntity } from "../entity/course.entity";

export interface ICourse {
  courses: ICourseEntity[];
  pagination: IPagination;
  teachers: { label: string; value: number }[];
  categories: { label: string; value: number }[];
}
