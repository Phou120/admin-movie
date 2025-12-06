import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { ITaxEntity } from "../entity/tax.entity";

export interface ITax {
  banners: ITaxEntity[];
  pagination: IPagination;
}

export interface ITaxForm {
  id?: number | null;
  name: string;
  percentage: number;
}
