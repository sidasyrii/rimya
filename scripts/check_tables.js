const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkTables() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error("Error accessing products table:", error.message);
  } else {
    console.log("Success! Products table exists and is accessible. Data:", data);
  }

  const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').limit(1);
  if (profileError) {
    console.error("Error accessing profiles table:", profileError.message);
  } else {
    console.log("Success! Profiles table exists and is accessible. Data:", profileData);
  }
}

checkTables();
