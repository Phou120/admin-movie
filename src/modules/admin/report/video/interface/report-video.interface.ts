export interface IReportVideo {
  id?: number;
  title?: string;
  content?: string;
  total_views?: number;
  total_likes?: number;
  customer_name?: string;
  customer_id?: number;
  categories?: string[];
  category_ids?: number[];
  status?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  video_url?: string;
  trailer_url?: string;
}

export interface IReportVideoList {
  videos: IReportVideo[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
  };
}

export interface IReportVideoSummary {
  total_views: number;
  total_likes: number;
  active_videos: number;
  total_videos: number;
}

export interface IReportVideoFilters {
  search: string;
  category_id?: number;
  customer_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export interface IReportVideoChart {
  labels: string[];
  data: number[];
}

export interface ICategoryOption {
  id: number;
  name: string;
}

export interface ICustomerOption {
  id: number;
  name: string;
}
