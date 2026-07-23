import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log(`Checking connection to: ${supabaseUrl}`);
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    
    if (error) {
       console.log('❌ Connected to Supabase, but encountered an error querying the products table:', error.message);
       console.log('Did you run the supabase_schema.sql script in the Supabase SQL editor?');
    } else {
       console.log('✅ Successfully connected to Supabase!');
       console.log('✅ Schema successfully verified! Found products table with data:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('❌ Failed to connect to Supabase:', err.message);
  }
}

testConnection();
