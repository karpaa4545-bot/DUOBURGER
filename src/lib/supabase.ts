import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zqfjbniccgarxtepckcl.supabase.co";
const supabaseAnonKey = "sb_publishable_5KkriQZxHeDLyeYpQMwndQ_Bc1gvj-M";

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
