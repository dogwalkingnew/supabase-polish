/**
 * DogWalking — Confiance canine de proximité : l’authentification ne doit pas
 * perturber la lecture publique ni les routes directes, quel que soit le support.
 */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Tables<"profiles"> | null;
  loading: boolean;
  profileError: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string; user_type?: string }) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const prerenderAuthContext: AuthContextType = {
  session: null,
  user: null,
  profile: null,
  loading: false,
  profileError: false,
  signUp: async () => ({ error: new Error("L’authentification est disponible après le chargement de l’application.") }),
  signIn: async () => ({ error: new Error("L’authentification est disponible après le chargement de l’application.") }),
  signOut: async () => {},
  refreshProfile: async () => {},
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Le build SPA pré-rend un shell sans navigateur. Ne pas initialiser Supabase
  // dans ce contexte : les variables publiques restent obligatoires au runtime
  // client, mais l’absence de secrets dans la CI ne doit pas produire un 500 SSR.
  if (typeof window === "undefined") {
    return <AuthContext.Provider value={prerenderAuthContext}>{children}</AuthContext.Provider>;
  }

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    setProfile(data ?? null);
    setProfileError(Boolean(error || !data));
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setLoading(true);
          setTimeout(() => {
            void fetchProfile(session.user.id).finally(() => setLoading(false));
          }, 0);
        } else {
          setProfile(null);
          setProfileError(false);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setLoading(true);
        void fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setProfileError(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string; user_type?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata, emailRedirectTo: window.location.origin },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, profileError, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
