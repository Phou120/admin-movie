import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { IMemberEntity } from "../entity/member.entity";

export interface IMemberMembers {
  members: IMemberEntity[];
  pagination: IPagination;
}