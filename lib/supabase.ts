import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE!

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error('Variables d\'environnement Supabase manquantes')
}

// Client Supabase avec service role pour accès complet aux données
export const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Types pour les réponses de base de données
export interface DatabaseError {
  message: string
  details: string
  hint: string
  code: string
} 