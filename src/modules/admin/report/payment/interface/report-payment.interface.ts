export interface IReportPayment {
  id?: number;
  transaction_id?: string;
  member_name?: string;
  member_id?: number;
  package_name?: string;
  amount?: number;
  payment_type?: string;
  status?: string;
  slip_url?: string;
  payment_date?: string;
}

export interface IReportPaymentList {
  payments: IReportPayment[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
  };
}

export interface IReportPaymentSummary {
  total_revenue: number;
  pending_payments: number;
  approved_payments: number;
  rejected_payments: number;
  transaction_count: number;
}

export interface IReportPaymentFilters {
  search: string;
  status?: string;
  payment_type?: string;
  member_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface IReportPaymentChart {
  labels: string[];
  data: number[];
}

export interface IPaymentTypeOption {
  value: string;
  label: string;
}

export interface IMemberOption {
  id: number;
  name: string;
}
