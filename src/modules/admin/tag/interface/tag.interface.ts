import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { TagEntity } from "../entity/tag.entity";

export interface ITagList {
  tags: TagEntity[];
  pagination: IPagination;
}

export interface ITagForm {
  id?: number | null;
  name: string;
}