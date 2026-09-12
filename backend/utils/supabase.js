/* =========================================================
   GOSUBSIDY BACKEND
   SUPABASE ADMIN CLIENT
========================================================= */

import { createClient } from "@supabase/supabase-js";


const supabaseUrl =
  process.env.SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;


/* =========================================================
   VALIDATE ENVIRONMENT
========================================================= */

if (!supabaseUrl) {
  throw new Error(
    "SUPABASE_URL is missing from backend environment variables."
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is missing from backend environment variables."
  );
}


/* =========================================================
   CREATE SERVER-SIDE SUPABASE CLIENT
========================================================= */

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);


/* =========================================================
   EXPORT
========================================================= */

export default supabase;