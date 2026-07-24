const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  console.log("Signing up admin user...");
  const { data, error } = await supabase.auth.signUp({
    email: 'theanubandha@gmail.com',
    password: 'AdminPassword123!',
    options: {
      data: {
        first_name: 'Admin',
        last_name: 'User'
      }
    }
  });

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Success! User ID:", data.user?.id);
  }
}

main();
