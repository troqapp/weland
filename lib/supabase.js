import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fvxbktfzpxcnkwxtqonn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eGJrdGZ6cHhjbmt3eHRxb25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMTIzNzcsImV4cCI6MjA3MTU4ODM3N30.3IKDc9aCdSGF34jglChZ66Txd43RZiQY4YIitZ4djPs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
