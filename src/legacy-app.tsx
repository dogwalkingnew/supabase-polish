/**
 * DogWalking — Confiance canine de proximité : montage client sobre et fiable
 * pour que chaque route se charge après une mise à jour, y compris sur mobile.
 */
import { createElement, lazy, Suspense, useEffect, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { retireLegacyServiceWorker } from "./lib/retire-legacy-service-worker";

const App = lazy(() => import("./App"));

function Splash() {
  return createElement(
    "div",
    { className: "flex min-h-screen items-center justify-center bg-background" },
    createElement("div", {
      className: "h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent",
    }),
  );
}

export function LegacyApp() {
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    retireLegacyServiceWorker();
    // BrowserRouter initialise son historique en remplaçant l’état courant. Attendre le
    // premier commit évite de notifier TanStack pendant que son shell est encore rendu.
    setIsClientReady(true);
  }, []);

  if (!isClientReady) return createElement(Splash);

  return createElement(
    ClientOnly,
    {
      fallback: createElement(Splash),
      children: createElement(Suspense, {
        fallback: createElement(Splash),
        children: createElement(App),
      }),
    },
  );
}
