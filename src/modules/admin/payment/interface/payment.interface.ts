import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { PaymentEntity } from "../entity/payment.entity";

export interface IPaymentList {
  payments: PaymentEntity[];
  pagination: IPagination;
}

export interface IPaymentForm {
  id?: number | null;
  bank_currency_id: number;
  user_id: number;
  use_package_id: number;
  payment_type: string;
  slip?: string;
  status: string;
}