import { createFileRoute } from "@tanstack/react-router";
import { LegacyApp } from "@/legacy-app";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "DogWalking — Promenade & garde de chiens vérifiées" },
      {
        name: "description",
        content:
          "Plateforme française de mise en relation entre propriétaires de chiens et promeneurs certifiés. Paiement sécurisé et preuves photo.",
      },
      { property: "og:title", content: "DogWalking" },
      {
        property: "og:description",
        content: "Promeneurs et pet-sitters vérifiés partout en France.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LegacyApp,
});
