import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  refreshClaims: () => Promise<void>; 
  logout: () => Promise<void>;
  isAdmin: boolean;
  loading: boolean;
}