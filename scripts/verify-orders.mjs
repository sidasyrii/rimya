import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTable() {
  try {
    const { data, error } = await supabase.from('orders').select('address_id').limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('❌ address_id column is MISSING in orders table! Or orders table is missing.');
        console.error(error.message);
      } else {
        console.log('Error but table exists:', error.message);
      }
    } else {
      console.log('✅ address_id column exists in orders table!');
    }
  } catch (err) {
    console.error('Error fetching schema:', err);
  }
}

verifyTable();
