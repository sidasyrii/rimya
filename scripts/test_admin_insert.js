const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// We need the service role to check auth.users directly, 
// but we can check profiles with the anon key and is_admin().
// Wait, we can't query auth.users without service role.
// Let's just try to insert a test product using the admin credentials to see if RLS blocks it.

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAdminInsert() {
  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'theanubandha@gmail.com',
    password: 'AdminPassword123!',
  });

  if (loginError) {
    console.error("Failed to login:", loginError.message);
    return;
  }

  console.log("Logged in successfully as", session.user.email);
  
  // Try inserting a category
  const { data: category, error: catError } = await supabase
    .from('categories')
    .insert([{ name: 'Test Category', slug: 'test-category-' + Date.now() }])
    .select()
    .single();

  if (catError) {
    console.error("Failed to insert category. RLS might be blocking:", catError.message);
  } else {
    console.log("Successfully inserted category:", category.name);
    
    // Clean up
    await supabase.from('categories').delete().eq('id', category.id);
  }
}

testAdminInsert();
