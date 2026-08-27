/**
 * DogWalking — SEO factuel : le balisage ne contient que l’identité de la plateforme
 * et une description de mise en relation, sans avis, note, promesse ou contact inventé.
 */
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "service";
  noindex?: boolean;
}

export const SEOHead = ({
  title = "DogWalking | Mise en relation pour les besoins de votre animal",
  description = "Consultez les profils et services renseignés, puis organisez une demande avec un Accompagnateur.",
  canonical,
  image,
  type = "website",
  noindex = false,
}: SEOHeadProps) => {
  const siteUrl = canonical || (typeof window !== "undefined" ? window.location.origin : undefined);
  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DogWalking",
    ...(siteUrl ? { url: siteUrl } : {}),
    description: "Plateforme de mise en relation permettant d’organiser des demandes liées aux animaux.",
  };
  const schemaWebSite = siteUrl ? {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DogWalking",
    url: siteUrl,
    potentialAction: { "@type": "SearchAction", target: `${siteUrl.replace(/\/$/, "")}/walkers?search={search_term_string}`, "query-input": "required name=search_term_string" },
  } : undefined;

  return <Helmet>
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    {canonical && <link rel="canonical" href={canonical} />}
    {noindex && <meta name="robots" content="noindex, nofollow" />}
    <meta property="og:type" content={type} />
    {siteUrl && <meta property="og:url" content={siteUrl} />}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={image} />}
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="DogWalking" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {image && <meta name="twitter:image" content={image} />}
    <meta name="theme-color" content="#00D084" />
    <meta name="author" content="DogWalking" />
    <script type="application/ld+json">{JSON.stringify(schemaOrganization)}</script>
    {schemaWebSite && <script type="application/ld+json">{JSON.stringify(schemaWebSite)}</script>}
  </Helmet>;
};
