import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { ExchangeRateEntity } from "../entity/exchange-rate.entity";

export interface IExchangeRateData {
  exchange_rates: ExchangeRateEntity[];
  pagination: IPagination;
}

export interface IExchangeRateForm {
  id?: number | null;
  from_currency_id: number;
  operate: "*" | "/";
  to_currency_id: number;
}

export interface ICurrencyOption {
  label: string;
  value: number;
}

export interface IOperationOption {
  label: string;
  value: "*" | "/";
  description: string;
}
