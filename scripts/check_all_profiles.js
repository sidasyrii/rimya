const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// We can't query auth.users, but we can query profiles if we use the admin account to bypass RLS!
// Wait, my test_admin_insert script logged in as admin. Let's do that to query all profiles.

async function checkAllProfiles() {
  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'theanubandha@gmail.com',
    password: 'AdminPassword123!',
  });

  if (loginError) {
    console.error("Failed to login:", loginError.message);
    return;
  }

  // Admin can view all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("All profiles in DB:", profiles);
  }
}

checkAllProfiles();
