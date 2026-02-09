import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { VideoEntity } from "../entity/video.entity";

export interface IVideoList {
  videos: VideoEntity[];
  pagination: IPagination;
}

export interface IVideoForm {
  id?: number | null;
  customer_id: number | null;
  title: string;
  content: string;
  image?: File | null | undefined;
  video_name?: File | null | undefined;
  trailer?: File | null | undefined;
  category_id?: number[];
}