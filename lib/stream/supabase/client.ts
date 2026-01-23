import { createClient } from "@supabase/supabase-js";
// TODO: handle env vars mismatch
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// console.log("Env")
// console.log(supabaseUrl,supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);