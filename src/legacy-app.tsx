import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";

const App = lazy(() => import("./App"));

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

/**
 * Monte l'application (React Router) côté client uniquement.
 * Toute la navigation interne est gérée par BrowserRouter dans App.tsx.
 */
export function LegacyApp() {
  return (
    <ClientOnly fallback={<Splash />}>
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    </ClientOnly>
  );
}
