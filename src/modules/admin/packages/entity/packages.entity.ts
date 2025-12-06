export interface PackagesEntity {
  id: number;
  type: "1month" | "3month" | "6month" | "1year";
  price: number;
  content: string;
  created_at?: string;
  updated_at?: string;
}