import { supabase } from "@/lib/supabase/client";

export async function getUserWithRole() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email,
    role: profile.role as "priest" | "customer",
  };
}