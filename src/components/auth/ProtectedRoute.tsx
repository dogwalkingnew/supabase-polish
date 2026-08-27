import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "owner" | "walker" | "admin";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading, profileError } = useAuth();
  const location = useLocation();
  const [adminCheck, setAdminCheck] = useState<"idle" | "checking" | "ok" | "denied">("idle");

  // Vérification serveur du rôle admin via la table user_roles (anti-escalade de privilèges)
  useEffect(() => {
    if (requiredRole !== "admin") return;
    if (!user) return;
    setAdminCheck("checking");
    (async () => {
      const { data, error } = await (supabase as any)
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setAdminCheck(!error && data ? "ok" : "denied");
    })();
  }, [requiredRole, user]);

  if (loading || (requiredRole === "admin" && adminCheck === "checking")) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (requiredRole !== "admin" && profileError) {
    return <Navigate to="/auth?error=profil-indisponible" replace />;
  }

  // Admin : strict, basé sur la table user_roles côté serveur
  if (requiredRole === "admin") {
    if (adminCheck === "denied") {
      return <Navigate to="/" replace />;
    }
    if (adminCheck !== "ok") {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }
  }

  // Owner / Walker : le rôle est vérifié avant tout affichage de l’espace privé.
  if (requiredRole && requiredRole !== "admin" && profile?.user_type) {
    if (profile.user_type !== requiredRole && profile.user_type !== "both") {
      return <Navigate to={profile.user_type === "walker" ? "/walker/dashboard" : "/dashboard"} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
