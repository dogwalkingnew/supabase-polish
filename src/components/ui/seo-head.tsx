import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  structuredData?: object;
  noIndex?: boolean;
}

export const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = "website",
  structuredData,
  noIndex = false,
}: SEOHeadProps) => {
  const siteName = "DogWalking";
  const fullTitle = title.toLowerCase().includes(siteName.toLowerCase())
    ? title
    : `${title} | ${siteName}`;
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://dogwalking.fr";
  const absoluteOgImage = ogImage ? (ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`) : undefined;
  const absoluteCanonical = canonicalUrl && !canonicalUrl.startsWith("http") ? `${baseUrl}${canonicalUrl}` : canonicalUrl;

  // Default LocalBusiness structured data
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": siteName,
    "description": "Plateforme de mise en relation pour organiser des demandes de promenade, garde et visite d’animaux.",
    "url": baseUrl,
    "logo": `${baseUrl}/favicon.ico`,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "FR"
    },
    "areaServed": {
      "@type": "Country",
      "name": "France"
    },
    "serviceType": [
      "Promenade de chien",
      "Garde de chien",
      "Dog sitting",
      "Pet care"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      {absoluteCanonical && <link rel="canonical" href={absoluteCanonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {absoluteOgImage && <meta property="og:image" content={absoluteOgImage} />}
      {absoluteCanonical && <meta property="og:url" content={absoluteCanonical} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
      
      {/* Additional SEO */}
      <meta name="author" content={siteName} />
      <meta name="language" content="French" />
      <meta name="geo.region" content="FR" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
};

// Predefined structured data generators
export const generateServiceSchema = (service: {
  name: string;
  description: string;
  price: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": service.name,
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "Organization",
    "name": "DogWalking"
  },
  "areaServed": {
    "@type": "Country",
    "name": "France"
  },
  "offers": {
    "@type": "Offer",
    "price": service.price.replace("€", ""),
    "priceCurrency": "EUR"
  }
});

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateArticleSchema = (article: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "DogWalking"
  },
  "datePublished": article.datePublished,
  "image": article.image
});
