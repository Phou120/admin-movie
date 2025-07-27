export interface CustomerEntity {
  id: number;
  name: string;
  surname: string;
  birth_date: string;
  gender: string;
  address: string;
  created_at: string;
  updated_at: string;
  user: IUser;
}

interface IUser {
  id: number;
  name: string;
  email: string;
}
