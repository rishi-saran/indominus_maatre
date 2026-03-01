import { supabase } from "@/lib/supabase/client";

export async function getUserWithRole() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Prefer user_metadata role (self-signed-up users) but fall back to
  // public.users table for accounts created via auth.admin.create_user
  // (admin-panel onboarding), which don't have role in user_metadata.
  let role = user.user_metadata?.role as string | undefined;

  if (!role) {
    const { data: userRow } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    role = userRow?.role ?? undefined;
  }

  if (!role) return null;

  return {
    id: user.id,
    email: user.email,
    role: role as "priest" | "customer" | "admin",
  };
}