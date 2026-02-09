import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { ICustomerEntity } from "../entity/customer.entity";

export interface ICustomer {
  customers: ICustomerEntity[];
  pagination: IPagination;
}

export interface ICustomerForm {
  id?: number | null;
  name: string;
  surname: string;
  email: string;
  tel: string;
  address: string;
  profile: string | File | null;
  password?: string;
  confirm_password?: string;
}