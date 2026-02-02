// Supabase
// ⚠️ supabaseUrl, anon key는 공개 ㄱㅊ
export const config = {
  supabaseUrl: 'https://plifyyjdleafbvqwigau.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaWZ5eWpkbGVhZmJ2cXdpZ2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjcxMDcsImV4cCI6MjA4NTUwMzEwN30.nubx_46hhc5c64MUQcVcQHzPAa32KiKq1KlwnwixJWg'
};

export const isSupabaseConfigured = () => {
  return (
    config.supabaseUrl && 
    config.supabaseUrl !== 'YOUR_SUPABASE_URL' &&
    config.supabaseUrl.startsWith('https://') &&
    config.supabaseAnonKey &&
    config.supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
  );
};

