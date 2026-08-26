import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText, Scale, Users, Database, Settings } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const RessourcesLegales = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("mentions");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["mentions", "cgu", "confidentialite"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-dvh bg-background">
      <SEOHead
        title="Ressources Légales | DogWalking"
        description="Projet de mentions légales, conditions d’utilisation et politique de confidentialité à compléter et faire valider avant publication de DogWalking."
        canonical="https://dogwalking.fr/ressources-legales"
        noindex
      />
      <Header />

      <main className="container mx-auto px-4 py-24 max-w-5xl">
        <h1 className="text-4xl font-bold mb-2">Ressources Légales</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Projet de documents à compléter avec les informations de l’éditeur et à faire valider avant publication.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="mentions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Mentions légales</span>
              <span className="sm:hidden">Mentions</span>
            </TabsTrigger>
            <TabsTrigger value="cgu" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              <span>CGU</span>
            </TabsTrigger>
            <TabsTrigger value="confidentialite" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Confidentialité</span>
              <span className="sm:hidden">RGPD</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== MENTIONS LÉGALES ===== */}
          <TabsContent value="mentions">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Éditeur du site</h2>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <p className="mb-2"><strong>Éditeur :</strong> à compléter avec la raison sociale ou l’identité réelle de l’éditeur.</p>
                  <p className="mb-2"><strong>Adresse :</strong> à compléter avec le siège ou l’adresse professionnelle réelle.</p>
                  <p className="mb-2"><strong>Immatriculation :</strong> à compléter avec le numéro réel requis pour l’activité concernée.</p>
                  <p><strong>Contact :</strong> contact@dogwalking.fr</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Hébergement</h2>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <p className="mb-2"><strong>Infrastructure de données :</strong> Supabase est utilisé pour les données de l’application.</p>
                  <p><strong>Hébergeur de production :</strong> à confirmer selon le mode de publication effectivement choisi.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Activité</h2>
                <p className="text-muted-foreground">
                  DogWalking est une plateforme de mise en relation destinée à organiser des demandes de promenade, garde, visite et accompagnement vétérinaire. Les modalités d’une mission sont à confirmer entre les personnes concernées. Le paiement en ligne n’est pas actif dans l’application à ce stade.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
                <p className="text-muted-foreground">
                  L'ensemble du contenu de ce site est la propriété exclusive de DogWalking France 
                  ou de ses partenaires, et est protégé par les lois françaises et internationales 
                  relatives à la propriété intellectuelle.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Protection des données personnelles</h2>
                <p className="text-muted-foreground">
                  Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit 
                  d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
                </p>
              </section>

              <p className="text-sm text-muted-foreground mt-12 pt-8 border-t">Dernière mise à jour : Avril 2026</p>
            </div>
          </TabsContent>

          {/* ===== CGU ===== */}
          <TabsContent value="cgu">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Préambule</h2>
                <p className="text-muted-foreground">
                  Les présentes Conditions Générales d'Utilisation régissent l'utilisation de la plateforme 
                  DogWalking accessible à l'adresse www.dogwalking.fr. En utilisant nos services, vous acceptez 
                  sans réserve les présentes CGU.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Article 1 - Définitions</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>"Plateforme"</strong> : le site internet DogWalking et ses fonctionnalités</li>
                  <li><strong>"Propriétaire"</strong> : utilisateur inscrit en qualité de Propriétaire d'animal</li>
                  <li><strong>"Accompagnateur"</strong> : utilisateur inscrit qui renseigne un profil et des services.</li>
                  <li><strong>"Mission"</strong> : demande ou organisation de service échangée via la Plateforme.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Article 2 - Objet de la Plateforme</h2>
                <p className="text-muted-foreground">
                  DogWalking est une plateforme de mise en relation permettant de consulter des profils, renseigner un animal, déposer des demandes et suivre les informations associées. L’application ne propose pas encore de paiement en ligne, de séquestre, de commission, de preuve obligatoire ou de remboursement automatisé.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Article 3 - Inscription et Certification</h2>
                <p className="text-muted-foreground">
                   L’inscription est ouverte selon les modalités affichées par la Plateforme. Les éventuelles pièces ou validations demandées doivent être décrites dans le parcours concerné lorsqu’elles seront effectivement mises en œuvre ; aucune certification, vérification manuelle ou taux de sélection ne doit être présumé.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Article 4 - Tarifs et modalités</h2>
                <p className="text-muted-foreground mb-4">
                  Les éventuels tarifs renseignés sur un profil sont indicatifs. Le prix, la durée, les conditions et le moyen de règlement doivent être confirmés entre le Propriétaire et l’Accompagnateur avant la mission. DogWalking ne traite pas de paiement, ne bloque pas de fonds et ne gère pas de remboursement automatisé à ce stade.
                </p>
                <p className="text-muted-foreground">Les modalités d’annulation doivent être convenues entre les personnes concernées, sauf politique explicite ajoutée et validée avant publication.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Article 5 - Obligations des Utilisateurs</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Propriétaire</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                      <li>Informations exactes sur son animal</li>
                      <li>Informations utiles à la mission</li>
                      <li>Confirmation des conditions avec l’Accompagnateur</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Accompagnateur</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                      <li>Profil et services renseignés avec exactitude</li>
                      <li>Confirmation préalable des conditions de mission</li>
                      <li>Bienveillance envers les animaux</li>
                      <li>Communication adaptée avec le Propriétaire</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Article 6 - Limites de la Plateforme</h2>
                <p className="text-muted-foreground">
                  DogWalking facilite l’organisation de demandes. L’application ne fournit pas actuellement de gestion financière, médiation, assurance, séquestre ni garantie de prestation. Les responsabilités et obligations applicables doivent être précisées et validées avant publication définitive.
                </p>
              </section>

              <p className="text-sm text-muted-foreground mt-12 pt-8 border-t">Dernière mise à jour : Avril 2026</p>
            </div>
          </TabsContent>

          {/* ===== CONFIDENTIALITÉ ===== */}
          <TabsContent value="confidentialite">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Responsable du traitement</h2>
                <p className="text-muted-foreground"><strong>Responsable du traitement :</strong> à compléter avec l’identité et le contact réellement compétents avant publication.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Données collectées</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Informations de compte et de profil renseignées par l’utilisateur.</li>
                  <li>Informations relatives aux animaux et aux demandes créées dans l’application.</li>
                  <li>Informations nécessaires au fonctionnement des réservations et échanges disponibles.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Finalités</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Gestion des comptes et mise en relation</li>
                  <li>Organisation des demandes et affichage des informations associées</li>
                  <li>Fonctionnement, sécurité et amélioration de l’application</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Vos droits</h2>
                <p className="text-muted-foreground">
                  Vous disposez des droits d'accès, de rectification, de suppression et d'opposition 
                  en contactant l’adresse de contact et les coordonnées du responsable qui devront être renseignées avant publication.
                </p>
              </section>

              <p className="text-sm text-muted-foreground mt-12 pt-8 border-t">Dernière mise à jour : Avril 2026</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default RessourcesLegales;
