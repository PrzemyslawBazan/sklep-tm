// lib/supabase.ts - Create a single shared instance
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key) => {
          try {
            const value = localStorage.getItem(key);

            if (!value) return null;

            JSON.parse(value);

            return value;
          } catch (e) {
            console.warn('[Supabase] Corrupted auth storage detected, clearing...');

            localStorage.removeItem(key);

            return null;
          }
        },

        setItem: (key, value) => {
          localStorage.setItem(key, value);
        },

        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      },
    },
  global: {
    headers: {
      'App': 'taxm-shop',
    },
  },
});

export default supabase;