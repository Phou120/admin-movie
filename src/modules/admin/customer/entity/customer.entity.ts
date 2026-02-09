export interface ICustomerEntity {
  id: number;
  name: string;
  surname: string;
  email: string;
  tel: string;
  address: string;
  status: string;
  type: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: {
    id: number;
    user_no: string | null;
    name: string;
    surname: string;
    email: string;
    tel: string;
    created_at: string;
    updated_at: string;
    profile: {
      id: number;
      image: string;
      image_url: string;
      user_id: number;
      created_at: string;
      updated_at: string;
    };
    permissions: any[];
  };
}