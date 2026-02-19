import { supabase } from "./client";

export async function fetchUserRole() {
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('User not authenticated');
    }

    // Fetch role from users table
    const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (error) {
        throw error;
    }

    return data.role;
}
