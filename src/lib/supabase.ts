import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Helper to check if Supabase is configured
const isSupabaseConfigured = () => {
    return (
        supabaseUrl &&
        supabaseUrl.startsWith('https://') &&
        supabaseAnonKey &&
        supabaseAnonKey !== 'your_supabase_anon_key'
    );
};

export const supabase = isSupabaseConfigured()
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Admin client for server-side operations
export const getSupabaseAdmin = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (!supabaseUrl.startsWith('https://') || !serviceRoleKey || serviceRoleKey === 'your_supabase_service_role_key') {
        return null;
    }
    return createClient(supabaseUrl, serviceRoleKey);
};
