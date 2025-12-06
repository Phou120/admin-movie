import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { CurrencyEntity } from "../entity/currency.entity";

export interface ICurrencyList {
  currencies: CurrencyEntity[];
  pagination: IPagination;
}

export interface ICurrencyForm {
  id?: number | null;
  name: string;
  short_name: string;
}