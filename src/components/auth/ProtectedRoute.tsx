import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "owner" | "walker" | "admin";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading, profileError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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

  const redirectTarget = !loading && !user
    ? `/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`
    : !loading && requiredRole !== "admin" && profileError
      ? "/auth?error=profil-indisponible"
      : !loading && requiredRole === "admin" && adminCheck === "denied"
        ? "/"
        : requiredRole !== "admin" && profile?.user_type && profile.user_type !== requiredRole && profile.user_type !== "both"
          ? profile.user_type === "walker" ? "/walker/dashboard" : "/dashboard"
          : null;

  useEffect(() => {
    if (redirectTarget) navigate(redirectTarget, { replace: true });
  }, [navigate, redirectTarget]);

  if (loading || (requiredRole === "admin" && adminCheck === "checking")) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (redirectTarget) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background" aria-live="polite">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Admin : strict, basé sur la table user_roles côté serveur
  if (requiredRole === "admin") {
    if (adminCheck !== "ok") {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
