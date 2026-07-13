import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  sku: string;
  name: string;
  name_ar: string | null;
  image_url: string | null;
  pieces_per_carton: number;
  unit_price_b2c: number;
  carton_price_b2c: number | null;
  is_active: boolean;
  sort_order: number | null;
};
