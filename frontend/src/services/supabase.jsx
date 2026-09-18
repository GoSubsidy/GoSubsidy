import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Android WebView compatibility:
// avoid a browser Web Locks wait that can leave Supabase auth
// initialization pending indefinitely.
const webViewSafeLock = async (_name, _acquireTimeout, callback) => {
  return await callback();
};

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      lock: webViewSafeLock,
    },
  }
);
