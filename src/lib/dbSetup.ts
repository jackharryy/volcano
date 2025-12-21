import { supabase } from '@/integrations/supabase/client';

export async function ensureTablesExist() {
  try {
    const { error } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);

    if (error && error.message.includes('does not exist')) {
      console.error('Database tables need to be created. Please run init_db.sql in Lovable.');
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Database check failed:', err);
    return false;
  }
}
