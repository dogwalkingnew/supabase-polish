// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

function forceProductionJsxRuntime(): Plugin {
  return {
    name: "dogwalking-force-production-jsx-runtime",
    apply: "build",
    enforce: "pre",
    config(_, { command }) {
      if (command !== "build") return;
      // Certains plugins peuvent modifier NODE_ENV après le démarrage du build.
      // TanStack/Vite lisent cette variable et configurent le transformeur JSX
      // pendant la résolution : la fixer ici évite jsxDEV dans le bundle SSR.
      process.env.NODE_ENV = "production";
      return {
        esbuild: { jsxDev: false },
        oxc: { jsx: { development: false, runtime: "automatic" } },
      };
    },
  };
}

export default defineConfig({
  vite: {
    plugins: [forceProductionJsxRuntime()],
    define: {
      // TanStack Start sélectionne le runtime JSX SSR via cette valeur au build.
      // Garder development en prévisualisation et injecter production dans `pnpm run build`.
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV === "production" ? "production" : "development"),
    },
    server: {
      // Les hôtes de prévisualisation Manus sont éphémères. Restreindre la règle à
      // l’ancien hôte empêchait tout rendu dans la prévisualisation courante.
      allowedHosts: [".manus.computer"],
    },
  },
});
