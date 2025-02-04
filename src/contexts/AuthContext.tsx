import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContextType, AuthState, User } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            role: 'user', // Default role, you should fetch this from your user profiles table
          },
          loading: false,
          error: null,
        });
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            role: 'user',
          },
          loading: false,
          error: null,
        });
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setState(prev => ({ ...prev, error: (error as Error).message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      setState(prev => ({ ...prev, error: (error as Error).message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setState(prev => ({ ...prev, error: (error as Error).message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}