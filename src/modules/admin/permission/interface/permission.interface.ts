import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { IPermissionEntity } from "../entity/permission.entity";

export interface IPermission {
  permissions: IPermissionEntity[];
  pagination: IPagination;
}

// permission.interface.ts
export interface IPermissionForm {
  id?: number | null;
  name: string;
  display_name: string;
}
