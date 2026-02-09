export interface VideoEntity {
  id?: number;
  customer_id: number;
  title: string;
  content: string;
  image?: string | File;
  image_url?: string;
  video_name?: string | File;
  video_url?: string;
  trailer?: string | File;
  trailer_url?: string;
  category_id?: number[];
  tag_id?: number[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  movie_tags?: Array<{
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }>;
  movie_categories?: Array<{
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }>;
}