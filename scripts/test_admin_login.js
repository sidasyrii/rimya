const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAdmin() {
  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'theanubandha@gmail.com',
    password: 'AdminPassword123!',
  });

  if (loginError) {
    console.error("Failed to login:", loginError.message);
    return;
  }

  console.log("Logged in successfully as", session.user.email);
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileError) {
    console.error("Failed to fetch profile:", profileError.message);
  } else {
    console.log("Profile Data:", profile);
  }
}

testAdmin();
