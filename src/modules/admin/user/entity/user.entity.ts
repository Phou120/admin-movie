import type { IPermissionEntity } from "../../permission/entity/permission.entity";
import type { IRoleEntity } from "../../role/entity/role.entity";

export interface IUserEntity {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  tel: string;
  image?: string;
  roles: [IRoleEntity];
  permissions: [IPermissionEntity];
  created_at: Date;
  updated_at: Date;
}
