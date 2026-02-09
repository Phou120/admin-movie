export interface BankInfo {
  id: number;
  logo: string;
  name: string;
}

export interface CurrencyInfo {
  id: number;
  short_name: string;
  name: string;
}

export interface UserInfo {
  id: number;
  name: string;
  surname: string;
  email: string;
  tel: string;
}

export interface PackageInfo {
  id: number;
  price: string;
  content: string;
  type: string;
}

export interface UsePackageInfo {
  id: number;
  package_id: number;
  start_date: string;
  end_date: string;
  package: PackageInfo;
}

export interface PaymentEntity {
  id: number;
  bank_currency_id: number;
  user_id: number;
  use_package_id: number;
  payment_type: string;
  slip: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  bank: BankInfo;
  currency: CurrencyInfo;
  user: UserInfo;
  usePackage: UsePackageInfo;
}