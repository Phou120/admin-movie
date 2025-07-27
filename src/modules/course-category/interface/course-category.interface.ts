import type { IPagination } from "../../../common/interface/pagination.interface";
import type { CourseCategoryEntity } from "../entity/course-category.entity";

export interface IUserCourseCategory {
  categories: CourseCategoryEntity[];
  pagination: IPagination;
}

export interface ICustomerForm {
  id?: number | null;
  name: string;
}
