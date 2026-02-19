import { supabase } from "@/lib/supabase/client";

export async function getUserWithRole() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const role = user.user_metadata?.role as "priest" | "customer" | undefined;

  if (!role) return null;

  return {
    id: user.id,
    email: user.email,
    role,
  };
}