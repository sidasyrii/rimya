import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySchema() {
  console.log("Verifying Supabase Schema Updates...");
  let allPass = true;

  // 1. Check if 'categories' table exists and works
  const { error: catErr } = await supabase.from('categories').select('id').limit(1);
  if (catErr && catErr.code === '42P01') {
    console.log("❌ Table 'categories' is MISSING. (Run supabase_categories.sql)");
    allPass = false;
  } else if (catErr) {
    console.log("⚠️ Table 'categories' issue:", catErr.message);
  } else {
    console.log("✅ Table 'categories' exists.");
  }

  // 2. Check if 'orders' has 'tracking_number' and 'admin_notes'
  const { data: orderData, error: ordErr } = await supabase.from('orders').select('tracking_number, admin_notes').limit(1);
  if (ordErr) {
    console.log("❌ Columns 'tracking_number' or 'admin_notes' are MISSING on 'orders'. (Run supabase_orders_admin.sql)");
    allPass = false;
  } else {
    console.log("✅ Columns 'tracking_number' and 'admin_notes' exist on 'orders'.");
  }

  // 3. Check if 'profiles' has 'role'
  const { error: profErr } = await supabase.from('profiles').select('role').limit(1);
  if (profErr) {
    console.log("❌ Column 'role' is MISSING on 'profiles'. (Run any of the updated scripts)");
    allPass = false;
  } else {
    console.log("✅ Column 'role' exists on 'profiles'.");
  }

  // 4. Check if 'coupons' table exists
  const { error: coupErr } = await supabase.from('coupons').select('id').limit(1);
  if (coupErr && coupErr.code === '42P01') {
    console.log("❌ Table 'coupons' is MISSING. (Run supabase_coupons.sql)");
    allPass = false;
  } else if (coupErr) {
    console.log("⚠️ Table 'coupons' issue:", coupErr.message);
  } else {
    console.log("✅ Table 'coupons' exists.");
  }

  // 5. Check if 'site_settings' table exists
  const { error: setErr } = await supabase.from('site_settings').select('key').limit(1);
  if (setErr && setErr.code === '42P01') {
    console.log("❌ Table 'site_settings' is MISSING. (Run supabase_settings.sql)");
    allPass = false;
  } else if (setErr) {
    console.log("⚠️ Table 'site_settings' issue:", setErr.message);
  } else {
    console.log("✅ Table 'site_settings' exists.");
  }

  console.log("\n--- Summary ---");
  if (allPass) {
    console.log("🎉 All database schema updates have been applied successfully!");
  } else {
    console.log("⚠️ Some updates are missing. Please run the indicated SQL files in your Supabase SQL editor.");
  }
}

verifySchema();
