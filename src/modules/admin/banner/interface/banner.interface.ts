import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { IBannerEntity } from "../entity/banner.entity";

export interface IBanner {
  banners: IBannerEntity[];
  pagination: IPagination;
}

// banner.interface.ts
export interface IBannerForm {
  id?: number | null;
  file_banner: string | File;
  link: string;
  order_by: number;
}
