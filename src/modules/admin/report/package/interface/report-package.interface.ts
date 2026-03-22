export interface IReportPackage {
  id?: number;
  name?: string;
  type?: string;
  price?: number;
  total_sales?: number;
  total_revenue?: number;
  active_subscriptions?: number;
  status?: string;
  created_at?: string;
}

export interface IReportPackageList {
  packages: IReportPackage[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
  };
}

export interface IReportPackageSummary {
  total_packages: number;
  active_packages: number;
  total_revenue: number;
  total_subscriptions: number;
}

export interface IReportPackageFilters {
  search: string;
  package_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export interface IReportPackageChart {
  labels: string[];
  data: number[];
}

export interface IPackageTypeOption {
  value: string;
  label: string;
}
