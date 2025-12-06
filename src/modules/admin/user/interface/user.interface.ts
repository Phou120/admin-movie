export interface IUserProfile {
  id: number;
  image: string;
  image_url: string;
  user_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface IUserRole {
  id: number;
  name: string;
}

export interface IUserPermission {
  id: number;
  name: string;
  display_name: string;
}

export interface IUser {
  id: number;
  user_no: string | null;
  name: string;
  surname: string;
  email: string;
  tel: string | null;
  created_at: string;
  updated_at: string;
  profile: IUserProfile | null;
  roles: IUserRole[];
  permissions: IUserPermission[];
}

export interface IUsers {
  users: IUser[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger: boolean;
  };
}

export interface IUserForm {
  id?: number;
  email: string;
  password: string;
  confirm_password: string;
  name: string;
  surname: string;
  tel: string;
  image: string;
  image_url: string;
  roles: number[];
  permissions: number[];
}

export interface IChangePassword {
  new_password: string;
  confirm_password: string;
}
