import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vsxsxoqmuqgzgngupbxs.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzeHN4b3FtdXFnemdudHVwYnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTcwMDAsImV4cCI6MjA2MDQ5MzAwMH0.H9jB6y7M8L3xN2yK5P7V1Y4Z9D8s6R0t3U5w2X1qE4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
