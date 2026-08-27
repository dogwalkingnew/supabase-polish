/**
 * DogWalking — Confiance canine de proximité : montage client sobre et fiable
 * pour que chaque route se charge après une mise à jour, y compris sur mobile.
 */
import { lazy, Suspense, useEffect } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { retireLegacyServiceWorker } from "./lib/retire-legacy-service-worker";

const App = lazy(() => import("./App"));

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function LegacyApp() {
  useEffect(() => {
    retireLegacyServiceWorker();
  }, []);

  return (
    <ClientOnly fallback={<Splash />}>
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    </ClientOnly>
  );
}
