/**
 * DogWalking — Confiance canine de proximité : les routes doivent rester fiables
 * après une mise à jour, sans présenter une interface figée par un cache ancien.
 */
const LEGACY_CACHE_PREFIX = "dogwalking-";

/**
 * Retire les anciens service workers DogWalking et leurs caches. L’application
 * n’enregistre plus de worker ; cette transition évite que des chunks obsolètes
 * empêchent l’ouverture des pages lazy sur mobile après un déploiement.
 */
export function retireLegacyServiceWorker(): void {
  if (typeof window === "undefined") return;

  void (async () => {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations
          .filter((registration) => new URL(registration.scope).origin === window.location.origin)
          .map((registration) => registration.unregister()),
      );
    }

    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith(LEGACY_CACHE_PREFIX))
          .map((cacheName) => caches.delete(cacheName)),
      );
    }
  })().catch((error: unknown) => {
    console.warn("[DogWalking] Nettoyage du cache historique non abouti", error);
  });
}
