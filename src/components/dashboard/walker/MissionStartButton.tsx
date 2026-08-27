/** DogWalking — confiance canine de proximité : preuve privée et transition de mission contrôlée. */
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Camera, MapPin, Play, Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface MissionStartButtonProps {
  bookingId: string;
  walkerId: string;
  dogName: string;
  /** Conservé pour compatibilité avec les tableaux historiques ; non utilisé dans la transition atomique. */
  ownerName?: string;
  status: "confirmed" | "in_progress" | "completed";
  onMissionStarted?: () => void;
  /** Conservé pour compatibilité ; la clôture passe désormais par le code de validation. */
  onMissionEnded?: () => void;
  className?: string;
}

export const MissionStartButton: React.FC<MissionStartButtonProps> = ({
  bookingId,
  walkerId,
  dogName,
  status,
  onMissionStarted,
  className,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Format invalide", description: "Veuillez sélectionner une photo.", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "La taille maximale est de 10 Mo.", variant: "destructive" });
      return;
    }

    clearSelection();
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadStartProofAndBeginMission = async () => {
    if (!selectedFile) return;

    setUploading(true);
    let storedPath: string | null = null;

    try {
      let location = { lat: null as number | null, lng: null as number | null };
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        location = { lat: position.coords.latitude, lng: position.coords.longitude };
      } catch {
        // La position reste facultative et n'est jamais demandée en cas de refus.
      }

      const extension = selectedFile.type.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "jpg";
      const fileName = `${walkerId}/${bookingId}/start_${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("walk-proofs")
        .upload(fileName, selectedFile, { contentType: selectedFile.type });

      if (uploadError) throw uploadError;
      storedPath = fileName;

      const { error: transitionError } = await (supabase as any).rpc("record_walk_proof_and_transition", {
        p_booking_id: bookingId,
        p_storage_path: fileName,
        p_photo_type: "start",
        p_caption: caption || null,
        p_location_lat: location.lat,
        p_location_lng: location.lng,
      });

      if (transitionError) throw transitionError;
      storedPath = null;

      toast({
        title: "Mission démarrée",
        description: "Le Propriétaire a été notifié de la prise en charge.",
      });
      clearSelection();
      setCaption("");
      setIsDialogOpen(false);
      onMissionStarted?.();
    } catch (error: any) {
      if (storedPath) {
        await supabase.storage.from("walk-proofs").remove([storedPath]);
      }

      const message = String(error?.message || "");
      const description = message.includes("Booking is not ready to start")
        ? "La mission n’est plus prête à démarrer. Actualisez la réservation."
        : message || "Impossible d’enregistrer la preuve de prise en charge.";
      toast({ title: "Erreur", description, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (status !== "confirmed") return null;

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className={cn("gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg", className)}
      >
        <Play className="h-4 w-4" />
        Prise en charge
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Prise en charge de {dogName}
            </DialogTitle>
            <DialogDescription>
              Ajoutez une photo pour confirmer la prise en charge du chien.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <Camera className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm"><strong>Photo obligatoire</strong> pour démarrer la mission.</p>
            </div>

            <AnimatePresence mode="wait">
              {previewUrl ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative"
                >
                  <img src={previewUrl} alt="Aperçu de la preuve" className="w-full max-h-48 object-cover rounded-lg" />
                  <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8" onClick={clearSelection}>
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium mb-1">Prendre ou sélectionner une photo</p>
                  <p className="text-sm text-muted-foreground">JPG, PNG ou format image pris en charge · 10 Mo max</p>
                </motion.div>
              )}
            </AnimatePresence>

            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />

            {previewUrl && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <Input placeholder="Ajouter un commentaire (optionnel)" value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={200} />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>Position ajoutée uniquement si vous l’autorisez.</span>
                </div>
                <Button onClick={uploadStartProofAndBeginMission} disabled={uploading || !selectedFile} className="w-full gap-2 bg-gradient-to-r from-primary to-accent">
                  {uploading ? "Envoi en cours…" : <><Send className="h-4 w-4" /> Démarrer la promenade</>}
                </Button>
              </motion.div>
            )}

            <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MissionStartButton;
