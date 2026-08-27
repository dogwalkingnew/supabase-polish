import { createFileRoute } from "@tanstack/react-router";
import { LegacyApp } from "@/legacy-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DogWalking — Demandes de promenade et garde" },
      {
        name: "description",
        content:
          "Trouvez un promeneur ou pet-sitter près de chez vous. Organisez votre demande et suivez les informations partagées pendant la mission.",
      },
      { property: "og:title", content: "DogWalking — Demandes de promenade et garde" },
      {
        property: "og:description",
        content:
          "Promeneurs et pet-sitters près de chez vous. Demandes suivies par statut et informations de mission centralisées.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LegacyApp,
});
