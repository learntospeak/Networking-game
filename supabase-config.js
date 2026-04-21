(function () {
  const SUPABASE_URL = "https://bbgylwsecwxdbwhdtklr.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_Ss1hhhv8eJmJxDW4uIj3HQ_KdtusqtY";

  // The anon key is designed for browser use. Row Level Security and table policies still control which rows the
  // signed-in user can read or mutate, so the client only needs the public project URL and anon key here.
  function createSupabaseClient() {
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      console.error("Supabase client library did not load.");
      return null;
    }

    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  window.NetlabSupabase = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    client: createSupabaseClient()
  };
})();
