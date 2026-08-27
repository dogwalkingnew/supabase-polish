/** DogWalking — confiance canine de proximité : affichage via URL signée pour les preuves privées. */
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Camera, CheckCircle, Clock, Download, Image as ImageIcon, MapPin, Play, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface WalkProof {
  id: string;
  photo_url: string;
  photo_type: string;
  caption: string | null;
  status: string;
  uploaded_at: string;
  location_lat: number | null;
  location_lng: number | null;
}

interface MissionProofViewerProps {
  bookingId: string;
  isOwner: boolean;
  onProofValidated?: () => void;
}

const photoTypeLabels: Record<string, { label: string; icon: typeof Camera; color: string }> = {
  start: { label: "Prise en charge", icon: Play, color: "bg-green-500" },
  during: { label: "Pendant la promenade", icon: Camera, color: "bg-blue-500" },
  end: { label: "Fin de mission", icon: CheckCircle, color: "bg-amber-500" },
};

const getStoragePath = (reference: string) => {
  if (!reference) return null;
  if (!/^https?:\/\//i.test(reference)) return reference.replace(/^\/+/, "");

  try {
    const marker = "/storage/v1/object/public/walk-proofs/";
    const pathname = new URL(reference).pathname;
    const position = pathname.indexOf(marker);
    return position >= 0 ? decodeURIComponent(pathname.slice(position + marker.length)) : null;
  } catch {
    return null;
  }
};

export const MissionProofViewer: React.FC<MissionProofViewerProps> = ({ bookingId, isOwner, onProofValidated }) => {
  const [proofs, setProofs] = useState<WalkProof[]>([]);
  const [proofUrls, setProofUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<WalkProof | null>(null);

  useEffect(() => {
    void fetchProofs();
  }, [bookingId]);

  const fetchProofs = async () => {
    try {
      const { data, error } = await supabase
        .from("walk_proofs")
        .select("*")
        .eq("booking_id", bookingId)
        .order("uploaded_at", { ascending: true });

      if (error) throw error;

      const nextProofs = (data || []) as WalkProof[];
      const signedUrls = await Promise.all(nextProofs.map(async (proof) => {
        const storagePath = getStoragePath(proof.photo_url);
        if (!storagePath) return [proof.id, ""] as const;

        const { data: signedData, error: signedError } = await supabase.storage
          .from("walk-proofs")
          .createSignedUrl(storagePath, 60 * 15);
        return [proof.id, signedError ? "" : signedData?.signedUrl || ""] as const;
      }));

      setProofs(nextProofs);
      setProofUrls(Object.fromEntries(signedUrls));
    } catch (error) {
      console.error("Erreur lors de la lecture des preuves :", error);
      setProofs([]);
      setProofUrls({});
    } finally {
      setLoading(false);
    }
  };

  const validateProof = async (proofId: string, approved: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("walk_proofs")
        .update({
          status: approved ? "validated" : "rejected",
          validated_at: new Date().toISOString(),
          validated_by: user?.id,
        })
        .eq("id", proofId);

      if (error) throw error;
      toast({ title: approved ? "Photo validée" : "Photo refusée", description: approved ? "La preuve a été acceptée." : "La photo a été refusée." });
      await fetchProofs();
      onProofValidated?.();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "validated") return <Badge className="bg-green-500 gap-1"><CheckCircle className="h-3 w-3" />Validée</Badge>;
    if (status === "rejected") return <Badge variant="destructive" className="gap-1"><X className="h-3 w-3" />Refusée</Badge>;
    return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />En attente</Badge>;
  };

  if (loading) {
    return <Card><CardContent className="flex items-center justify-center py-8"><motion.div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} /></CardContent></Card>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Preuves de la promenade
          {proofs.length > 0 && <Badge variant="secondary">{proofs.length} photo{proofs.length > 1 ? "s" : ""}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {proofs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"><ImageIcon className="h-8 w-8 text-muted-foreground" /></div>
            <p className="font-medium mb-1">Aucune photo reçue</p>
            <p className="text-sm text-muted-foreground">Les preuves photo apparaîtront ici une fois envoyées par l’Accompagnateur.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-8 bottom-4 w-0.5 bg-border" />
              {proofs.map((proof, index) => {
                const typeInfo = photoTypeLabels[proof.photo_type] || photoTypeLabels.during;
                const TypeIcon = typeInfo.icon;
                const signedUrl = proofUrls[proof.id];

                return (
                  <motion.div key={proof.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="relative pl-12 pb-6">
                    <div className={`absolute left-2 top-1 w-5 h-5 rounded-full ${typeInfo.color} flex items-center justify-center`}><TypeIcon className="h-3 w-3 text-white" /></div>
                    <div className="bg-muted/50 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <button type="button" className="w-20 h-20 rounded-lg overflow-hidden shrink-0 text-left" onClick={() => signedUrl && setSelectedProof(proof)} disabled={!signedUrl} aria-label="Agrandir la preuve photo">
                          {signedUrl ? <img src={signedUrl} alt={proof.caption || "Preuve photo"} className="w-full h-full object-cover hover:scale-105 transition-transform" /> : <span className="h-full w-full grid place-items-center bg-muted text-xs text-muted-foreground p-2 text-center">Photo indisponible</span>}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1"><span className="font-medium">{typeInfo.label}</span>{getStatusBadge(proof.status)}</div>
                          <p className="text-sm text-muted-foreground mb-2">{format(new Date(proof.uploaded_at), "EEEE d MMMM 'à' HH:mm", { locale: fr })}</p>
                          {proof.caption && <p className="text-sm italic text-muted-foreground">“{proof.caption}”</p>}
                          {proof.location_lat && proof.location_lng && <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />Position enregistrée</div>}
                        </div>
                      </div>
                      {isOwner && proof.status === "pending" && (
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button size="sm" onClick={() => validateProof(proof.id, true)} className="flex-1 gap-1 bg-green-500 hover:bg-green-600"><CheckCircle className="h-4 w-4" />Valider</Button>
                          <Button size="sm" variant="outline" onClick={() => validateProof(proof.id, false)} className="flex-1 gap-1 text-destructive hover:bg-destructive/10"><X className="h-4 w-4" />Refuser</Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10"><AlertCircle className="h-5 w-5 text-primary shrink-0" /><div className="text-sm"><strong>Rappel :</strong> les preuves documentent le bon déroulement de la mission.</div></div>
          </div>
        )}

        <AnimatePresence>
          {selectedProof && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedProof(null)}>
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative max-w-3xl w-full" onClick={(event) => event.stopPropagation()}>
                {proofUrls[selectedProof.id] ? <img src={proofUrls[selectedProof.id]} alt="Preuve en grand" className="w-full max-h-[80vh] object-contain rounded-lg" /> : <div className="min-h-64 grid place-items-center rounded-lg bg-muted text-muted-foreground">Cette photo n’est plus disponible.</div>}
                <div className="absolute top-2 right-2 flex gap-2">
                  {proofUrls[selectedProof.id] && <Button size="icon" variant="secondary" asChild><a href={proofUrls[selectedProof.id]} download target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4" /></a></Button>}
                  <Button size="icon" variant="secondary" onClick={() => setSelectedProof(null)}><X className="h-4 w-4" /></Button>
                </div>
                {selectedProof.caption && <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg"><p className="text-white text-center">{selectedProof.caption}</p></div>}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default MissionProofViewer;
