import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { IPermissionEntity } from "../../permission/entity/permission.entity";
import type { IRoleEntity } from "../entity/role.entity";

export interface IRoles {
  roles: IRoleEntity[];
  pagination: IPagination;
}

// permission.interface.ts
export interface IRoleForm {
  id?: number | null;
  name: string;
  display_name: string;
  permission_ids: number[];
}

export interface PermissionModule {
  id: number;
  name: string;
  display_name: string;
  type: string;
  permissions: IPermissionEntity[];
}
