export interface IPermissionEntity {
  id: number;
  name: string;
  display_name: string;
  created_at: string;
  updated_at: string;
  permissions?: IPermission[];
}

export interface IPermission {
  id: number;
  name: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}
