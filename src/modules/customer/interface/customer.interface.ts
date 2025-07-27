import type { Dayjs } from "dayjs";
import type { IPagination } from "../../../common/interface/pagination.interface";
import type { CustomerEntity } from "../entity/customer.entity";

export interface ICustomer {
  customers: CustomerEntity[];
  pagination: IPagination;
}

export interface IUser {
  email?: string;
}

export interface ICustomerForm {
  id?: number | null;
  name: string;
  surname?: string;
  address?: string;
  birth_date?: Dayjs; // You can use `Dayjs` if needed
  gender?: string;
  user?: IUser;
  email: string;
  password?: string;
}
