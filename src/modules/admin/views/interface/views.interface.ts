import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { ViewsEntity } from "../entity/views.entity";

export interface IViewsData {
  views: ViewsEntity[];
  pagination: IPagination;
}

export interface IViewsForm {
  id?: number | null;
  qty: number;
  price: number;
}