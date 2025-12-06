import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { BankEntity } from "../entity/bank.entity";

export interface IBankList {
  banks: BankEntity[];
  pagination: IPagination;
}

export interface IBankForm {
  id?: number | null;
  name: string;
  logo: string | File | null; // Can be string (URL) or File object for upload
}
