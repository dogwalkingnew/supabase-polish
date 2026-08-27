import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();
  // TanStack ne sert ici que de shell SSR/route attrape-tout ; les parcours métier
  // utilisent le BrowserRouter historique. Un historique mémoire évite que les deux
  // routeurs écoutent et écrivent simultanément `window.history` à l’hydratation.
  const currentPath = typeof window === "undefined"
    ? "/"
    : `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const history = createMemoryHistory({ initialEntries: [currentPath] });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    history,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
