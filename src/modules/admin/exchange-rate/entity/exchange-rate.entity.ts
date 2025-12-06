export interface ExchangeRateEntity {
  id: number;
  from_currency_id: number;
  from_currency_name?: string;
  from_currency_code?: string;
  operate: "*" | "/";
  to_currency_id: number;
  to_currency_name?: string;
  to_currency_code?: string;
  created_at?: string;
  updated_at?: string;
}