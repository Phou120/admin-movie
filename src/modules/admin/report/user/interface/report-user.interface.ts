export interface IReportUser {
  id?: number;
  name?: string;
  surname?: string;
  email?: string;
  role?: string;
  status?: string;
  registration_date?: string;
  last_login?: string;
  login_count?: number;
  profile_image?: string;
  is_active?: boolean;
}

export interface IReportUserList {
  users: IReportUser[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
  };
}

export interface IReportUserSummary {
  total_users: number;
  active_users: number;
  new_registrations: number;
  role_breakdown: {
    admin: number;
    super_admin: number;
    customer: number;
  };
}

export interface IReportUserFilters {
  search: string;
  role?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export interface IReportUserChart {
  labels: string[];
  data: number[];
}

export interface IRoleOption {
  value: string;
  label: string;
}
