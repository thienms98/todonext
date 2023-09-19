
import { createClient } from '@supabase/supabase-js'

if(!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing Supabase\'s URL')
if(!process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY) throw new Error('Missing Supabase\'s public anon key')


export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY,
  // { db: { schema: 'public'} }
  );
