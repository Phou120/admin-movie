export interface BankEntity {
  id: number;
  name: string;
  logo: string; // This will store the image identifier like "019ac039-5075-755a-a9f8-bd7ed2769d23-1764161572981"
  logo_url: string; // This will store the full CloudFront URL
  created_at?: string;
  updated_at?: string;
}