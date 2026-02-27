'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { AuthContextType } from '../types/auth';
import { supabase } from '../lib/supabase';
import { useClearCartOnLogout } from './CartContext';
import { useCartStore } from './CartContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const ADMIN_CACHE_KEY = 'admin_status_cache';

const getAdminCache = (): Record<string, boolean> => {
  try {
    const cached = sessionStorage.getItem(ADMIN_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

const setAdminCache = (userId: string, isAdmin: boolean) => {
  try {
    const cache = getAdminCache();
    cache[userId] = isAdmin;
    sessionStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(cache));
  } catch {
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const lastCheckedUserRef = useRef<string | null>(null);
  const initializingRef = useRef(false);
  
  useEffect(() => {
    if (initializingRef.current) return;
    initializingRef.current = true;
    
    let mounted = true;

    const getInitialSession = async () => {
      try {
        console.log('🔄 Getting initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted && session?.user) {
          console.log('👤 User found:', session.user.id);
          setUser(session.user);
          
          const cache = getAdminCache();
          if (cache[session.user.id] !== undefined) {
            console.log('📦 Using cached admin status');
            setIsAdmin(cache[session.user.id]);
            lastCheckedUserRef.current = session.user.id;
          } else {
            await checkAdminStatus(session.user);
          }
        } else {
          console.log('No user found');
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log(`Auth event: ${event}, User: ${session?.user?.id || 'none'}`);
        
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          if (session?.user) {
            if (session.user.id !== lastCheckedUserRef.current) {
              console.log('User changed, updating...');
              setUser(session.user);
              
              const cache = getAdminCache();
              if (cache[session.user.id] !== undefined) {
                console.log('Using cached admin status for new user');
                setIsAdmin(cache[session.user.id]);
                lastCheckedUserRef.current = session.user.id;
              } else {
                await checkAdminStatus(session.user);
              }
            } else {
              console.log('Same user, skipping update');
            }
          } else {
            console.log('User signed out');
            setUser(null);
            setIsAdmin(false);
            lastCheckedUserRef.current = null;
          }
        } else {
          console.log(`Ignoring ${event} event`);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); 

  const checkAdminStatus = async (user: User) => {
    if (lastCheckedUserRef.current === user.id) {
      console.log('⏭️ Already checked this user, skipping');
      return;
    }
    
    lastCheckedUserRef.current = user.id;

    try {
      console.log('🔍 Checking admin status for user:', user.id);
      
      // Quick table access check
      const { count, error: countError } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Cannot access admin_users table:', countError);
        setIsAdmin(false);
        setAdminCache(user.id, false);
        return;
      }
      
      console.log('admin_users table accessible');
      
      // Check for the specific user
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const isUserAdmin = !error && !!adminData;
      console.log('👑 Admin check result:', isUserAdmin);
      
      setIsAdmin(isUserAdmin);
      setAdminCache(user.id, isUserAdmin);
      
    } catch (error) {
      console.error('Unexpected error checking admin status:', error);
      setIsAdmin(false);
      setAdminCache(user.id, false);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  };

  const logout = async (): Promise<void> => {
    // Clear cache for current user
    if (user?.id) {
      const cache = getAdminCache();
      delete cache[user.id];
      sessionStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(cache));
    }
    lastCheckedUserRef.current = null;

    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    useCartStore.getState().clearCartOnLogout();
  };

  const refreshClaims = async () => {
    if (user) {
      console.log('Refreshing claims...');
      const cache = getAdminCache();
      delete cache[user.id];
      sessionStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(cache));
      lastCheckedUserRef.current = null;
      
      const { data: { session } } = await supabase.auth.refreshSession();
      if (session?.user) {
        await checkAdminStatus(session.user);
      }
    }
  };

  const value: AuthContextType = {
    user,
    refreshClaims,
    isAdmin,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { supabase };