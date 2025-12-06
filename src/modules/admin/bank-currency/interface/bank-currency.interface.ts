import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { BankCurrencyEntity } from "../entity/bank-currency.entity";

// Extended entity with nested currency data
export interface BankCurrencyWithCurrency extends BankCurrencyEntity {
  currency: {
    id: number;
    name: string;
    short_name: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
}

export interface IBankCurrencyList {
  bankCurrencies: BankCurrencyWithCurrency[];
  pagination: IPagination;
}

export interface IBankCurrencyForm {
  id?: number | null;
  bank_id: number;
  currency_id: number;
}
