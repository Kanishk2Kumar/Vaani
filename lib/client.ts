
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xcnigjohlmsohjovsdsl.supabase.co'
const supabaseKey = "Enter your key"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;