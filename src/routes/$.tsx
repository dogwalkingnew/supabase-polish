import { createFileRoute } from "@tanstack/react-router";
import { LegacyApp } from "@/legacy-app";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "DogWalking — Demandes de promenade et garde" },
      {
        name: "description",
        content:
          "Plateforme de mise en relation pour organiser des demandes de promenade, garde, visite et accompagnement vétérinaire.",
      },
      { property: "og:title", content: "DogWalking" },
      {
        property: "og:description",
        content: "Consultez les profils et organisez vos demandes avec les informations disponibles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LegacyApp,
});
