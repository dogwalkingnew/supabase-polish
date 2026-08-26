import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Heart, Search, Megaphone, ChevronRight, ChevronLeft, Calendar, Users, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

export const SearchForm = () => {
  const navigate = useNavigate();
  const [animalTypes, setAnimalTypes] = useState<string[]>(["chien"]);
  const [selectedService, setSelectedService] = useState("");
  const [address, setAddress] = useState("");
  const [isAnnonceLivre, setIsAnnonceLivre] = useState(false);
  const [step, setStep] = useState(1);

  // État pour Annonce Libre
  const [annonceTitle, setAnnonceTitle] = useState("");
  const [annonceDescription, setAnnonceDescription] = useState("");
  const [annonceStartDate, setAnnonceStartDate] = useState("");
  const [annonceEndDate, setAnnonceEndDate] = useState("");
  const [annonceFrequency, setAnnonceFrequency] = useState("");
  const [accompanistChoice, setAccompanistChoice] = useState(""); // "select" ou "open"

  const servicesAbsent = [
    { id: "hebergement_nuit", label: "Hébergement chez l'Accompagnateur", icon: Heart },
    { id: "garde_domicile", label: "Garde au domicile du Propriétaire", icon: Heart },
  ];

  const servicesTravail = [
    { id: "visite_domicile", label: "Visites au domicile du Propriétaire", icon: Heart },
    { id: "hebergement_jour", label: "Garderie chez l'Accompagnateur", icon: Heart },
    { id: "promenade", label: "Promenade de chien", icon: Heart },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (address) params.set("location", address);
    if (selectedService) params.set("service", selectedService);
    navigate(`/find-walkers?${params.toString()}`);
  };

  const handleAnnonceSubmit = () => {
    // Validation basique
    if (!annonceTitle || !annonceDescription || !annonceStartDate || !accompanistChoice) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Créer l'annonce et rediriger
    const annonceData = {
      title: annonceTitle,
      description: annonceDescription,
      startDate: annonceStartDate,
      endDate: annonceEndDate,
      frequency: annonceFrequency,
      location: address,
      animalTypes: animalTypes,
      accompanistChoice: accompanistChoice,
    };

    // Stocker temporairement et rediriger
    sessionStorage.setItem("annonceData", JSON.stringify(annonceData));
    navigate("/annonces-libres");
  };

  const resetForm = () => {
    setIsAnnonceLivre(false);
    setStep(1);
    setSelectedService("");
    setAnnonceTitle("");
    setAnnonceDescription("");
    setAnnonceStartDate("");
    setAnnonceEndDate("");
    setAnnonceFrequency("");
    setAccompanistChoice("");
  };

  // ========== FORMULAIRE RECHERCHE STANDARD ==========
  if (!isAnnonceLivre) {
    return (
      <div className="bg-card shadow-card rounded-2xl p-6 md:p-8 max-w-xl mx-auto border border-border">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Je cherche un service pour mon :
        </h2>

        {/* Type d'animal */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">Type d'animal</Label>
          <div className="flex gap-6">
            {[
              { id: "chien", emoji: "🐕", label: "Chien" },
              { id: "chat", emoji: "🐱", label: "Chat" },
              { id: "autre", emoji: "🐾", label: "Autre animal" },
            ].map((animal) => (
              <div key={animal.id} className="flex items-center gap-2">
                <Checkbox
                  id={animal.id}
                  checked={animalTypes.includes(animal.id)}
                  onCheckedChange={(checked) => {
                    setAnimalTypes(prev =>
                      checked
                        ? [...prev, animal.id]
                        : prev.filter(t => t !== animal.id)
                    );
                  }}
                  className="border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor={animal.id} className="flex items-center gap-2 cursor-pointer text-base">
                  <span className="text-xl">{animal.emoji}</span> {animal.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Services quand absent */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">Quand vous êtes absent</Label>
          <RadioGroup 
            value={selectedService} 
            onValueChange={setSelectedService}
            className="space-y-3"
          >
            {servicesAbsent.map((service) => (
              <div 
                key={service.id}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedService === service.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <RadioGroupItem value={service.id} id={service.id} className="border-primary" />
                <Heart className="h-5 w-5 text-heart fill-heart" />
                <Label htmlFor={service.id} className="cursor-pointer flex-1 text-base font-medium">
                  {service.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Services quand au travail */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">Quand vous êtes au travail</Label>
          <RadioGroup 
            value={selectedService} 
            onValueChange={setSelectedService}
            className="space-y-3"
          >
            {servicesTravail.map((service) => (
              <div 
                key={service.id}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedService === service.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <RadioGroupItem value={service.id} id={service.id} className="border-primary" />
                <Heart className="h-5 w-5 text-heart fill-heart" />
                <Label htmlFor={service.id} className="cursor-pointer flex-1 text-base font-medium">
                  {service.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Promenade de chien - option spéciale */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">Promenade de chien</Label>
          <RadioGroup
            value={selectedService}
            onValueChange={setSelectedService}
          >
            <div 
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedService === "promenade" 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedService("promenade")}
            >
              <RadioGroupItem value="promenade" id="promenade-option" className="border-primary" />
              <Heart className="h-5 w-5 text-heart fill-heart" />
              <Label htmlFor="promenade-option" className="cursor-pointer flex-1 text-base font-medium">
                Promenade de chien
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Annonce Libre - nouvelle option intégrée */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">Ou créer une annonce libre</Label>
          <RadioGroup
            value={selectedService}
            onValueChange={(value) => {
              setSelectedService(value);
              if (value === "annonce-libre") {
                setIsAnnonceLivre(true);
                setStep(1);
              }
            }}
          >
            <div 
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedService === "annonce-libre" 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => {
                setSelectedService("annonce-libre");
                setIsAnnonceLivre(true);
                setStep(1);
              }}
            >
              <RadioGroupItem value="annonce-libre" id="annonce-libre-option" className="border-primary" />
              <Megaphone className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <Label htmlFor="annonce-libre-option" className="cursor-pointer text-base font-medium block">
                  Créer une annonce libre
                </Label>
                <p className="text-sm text-muted-foreground">Décrivez votre besoin et laissez les Accompagnateurs vous proposer leurs services</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Adresse */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">Adresse</Label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input 
              type="text" 
              placeholder="Ajoutez votre adresse ou ville" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="pl-12 h-14 text-base rounded-xl border-2"
            />
          </div>
        </div>

        {/* Bouton rechercher */}
        <Button 
          className="w-full h-14 text-lg font-semibold rounded-xl"
          onClick={handleSearch}
          disabled={!selectedService || !address}
        >
          <Search className="h-5 w-5 mr-2" />
          Trouver un Accompagnateur
        </Button>
      </div>
    );
  }

  // ========== FORMULAIRE ANNONCE LIBRE - ÉTAPES ==========
  return (
    <div className="bg-card shadow-card rounded-2xl p-6 md:p-8 max-w-2xl mx-auto border border-border">
      {/* Indicateur d'étapes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-muted-foreground">
            Étape {step} sur 4
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetForm}
            className="text-xs"
          >
            Annuler
          </Button>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s}
              className={`flex-1 h-2 rounded-full transition-all ${
                s <= step ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ÉTAPE 1 : Titre et Description */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Décrivez votre annonce
          </h2>
          
          <div className="mb-6">
            <Label className="text-base font-medium mb-3 block">Titre de l'annonce *</Label>
            <Input 
              type="text" 
              placeholder="Ex: Promenade quotidienne pour mon Labrador"
              value={annonceTitle}
              onChange={(e) => setAnnonceTitle(e.target.value)}
              className="h-12 text-base rounded-xl border-2"
            />
          </div>

          <div className="mb-6">
            <Label className="text-base font-medium mb-3 block">Description détaillée *</Label>
            <Textarea 
              placeholder="Décrivez vos besoins, les caractéristiques de votre animal, vos préférences..."
              value={annonceDescription}
              onChange={(e) => setAnnonceDescription(e.target.value)}
              className="min-h-32 text-base rounded-xl border-2"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 h-12 rounded-xl font-semibold"
              onClick={resetForm}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button 
              className="flex-1 h-12 rounded-xl font-semibold"
              onClick={() => setStep(2)}
              disabled={!annonceTitle || !annonceDescription}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ÉTAPE 2 : Dates et Fréquence */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Quand avez-vous besoin ?
          </h2>

          <div className="mb-6">
            <Label className="text-base font-medium mb-3 block">Date de début *</Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input 
                type="date"
                value={annonceStartDate}
                onChange={(e) => setAnnonceStartDate(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-2"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label className="text-base font-medium mb-3 block">Date de fin (optionnel)</Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input 
                type="date"
                value={annonceEndDate}
                onChange={(e) => setAnnonceEndDate(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-2"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label className="text-base font-medium mb-3 block">Fréquence (optionnel)</Label>
            <select 
              value={annonceFrequency}
              onChange={(e) => setAnnonceFrequency(e.target.value)}
              className="w-full h-12 px-4 text-base rounded-xl border-2 border-border bg-background"
            >
              <option value="">Sélectionner une fréquence</option>
              <option value="ponctuel">Ponctuel</option>
              <option value="hebdomadaire">Hebdomadaire</option>
              <option value="bi-hebdomadaire">Bi-hebdomadaire</option>
              <option value="mensuel">Mensuel</option>
              <option value="regulier">Régulier</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 h-12 rounded-xl font-semibold"
              onClick={() => setStep(1)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button 
              className="flex-1 h-12 rounded-xl font-semibold"
              onClick={() => setStep(3)}
              disabled={!annonceStartDate}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 : Localisation */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Où êtes-vous situé ?
          </h2>

          <div className="mb-6">
            <Label className="text-base font-medium mb-3 block">Adresse ou ville *</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input 
                type="text" 
                placeholder="Ajoutez votre adresse ou ville"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-2"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label className="text-base font-medium mb-3 block">Type d'animal</Label>
            <div className="space-y-3">
              {[
                { id: "chien", emoji: "🐕", label: "Chien" },
                { id: "chat", emoji: "🐱", label: "Chat" },
                { id: "autre", emoji: "🐾", label: "Autre animal" },
              ].map((animal) => (
                <div key={animal.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`annonce-${animal.id}`}
                    checked={animalTypes.includes(animal.id)}
                    onCheckedChange={(checked) => {
                      setAnimalTypes(prev =>
                        checked
                          ? [...prev, animal.id]
                          : prev.filter(t => t !== animal.id)
                      );
                    }}
                    className="border-primary data-[state=checked]:bg-primary"
                  />
                  <Label htmlFor={`annonce-${animal.id}`} className="flex items-center gap-2 cursor-pointer text-base">
                    <span className="text-xl">{animal.emoji}</span> {animal.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 h-12 rounded-xl font-semibold"
              onClick={() => setStep(2)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button 
              className="flex-1 h-12 rounded-xl font-semibold"
              onClick={() => setStep(4)}
              disabled={!address}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ÉTAPE 4 : Choix des Accompagnateurs */}
      {step === 4 && (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Comment souhaitez-vous être contacté ?
          </h2>

          <RadioGroup
            value={accompanistChoice}
            onValueChange={setAccompanistChoice}
            className="space-y-4 mb-8"
          >
            <div 
              className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                accompanistChoice === "select" 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setAccompanistChoice("select")}
            >
              <RadioGroupItem 
                value="select" 
                id="select-option" 
                className="border-primary mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="select-option" className="cursor-pointer text-base font-medium block mb-1">
                  <Users className="inline h-5 w-5 mr-2 text-primary" />
                  Sélectionner des Accompagnateurs
                </Label>
                <p className="text-sm text-muted-foreground">
                  Parcourez les profils disponibles et choisissez les Accompagnateurs qui vous conviennent
                </p>
              </div>
            </div>

            <div 
              className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                accompanistChoice === "open" 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setAccompanistChoice("open")}
            >
              <RadioGroupItem 
                value="open" 
                id="open-option" 
                className="border-primary mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="open-option" className="cursor-pointer text-base font-medium block mb-1">
                  <MessageSquare className="inline h-5 w-5 mr-2 text-primary" />
                  Laisser les Accompagnateurs vous proposer
                </Label>
                <p className="text-sm text-muted-foreground">
                  Les Accompagnateurs intéressés vous contacteront via la messagerie pour se proposer
                </p>
              </div>
            </div>
          </RadioGroup>

          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 h-12 rounded-xl font-semibold"
              onClick={() => setStep(3)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button 
              className="flex-1 h-12 rounded-xl font-semibold"
              onClick={handleAnnonceSubmit}
              disabled={!accompanistChoice}
            >
              Publier l'annonce
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
