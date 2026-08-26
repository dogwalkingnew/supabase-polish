import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface HealthRecord {
  id: string;
  dogName: string;
  type: "vaccination" | "checkup" | "treatment" | "alert";
  title: string;
  date: string;
  nextDate?: string;
  status: "ok" | "warning" | "alert";
  veterinarian?: string;
}

function buildRecordsFromDogs(dogs: any[]): HealthRecord[] {
  const records: HealthRecord[] = [];
  const today = new Date();

  dogs.forEach((dog) => {
    // Vaccination status based on vaccinations_up_to_date flag
    if (dog.vaccinations_up_to_date === true) {
      records.push({
        id: `vac-${dog.id}`,
        dogName: dog.name,
        type: "vaccination",
        title: "Vaccinations à jour",
        date: dog.updated_at?.slice(0, 10) || today.toISOString().slice(0, 10),
        status: "ok",
      });
    } else if (dog.vaccinations_up_to_date === false) {
      records.push({
        id: `vac-${dog.id}`,
        dogName: dog.name,
        type: "alert",
        title: "Vaccinations à mettre à jour",
        date: today.toISOString().slice(0, 10),
        status: "alert",
      });
    }

    // Neutered info → shows as checkup record
    if (dog.is_neutered !== null) {
      records.push({
        id: `neut-${dog.id}`,
        dogName: dog.name,
        type: "checkup",
        title: dog.is_neutered ? "Stérilisé(e)" : "Non stérilisé(e)",
        date: dog.created_at?.slice(0, 10) || today.toISOString().slice(0, 10),
        status: "ok",
      });
    }

    // Special needs → treatment record
    if (dog.special_needs) {
      records.push({
        id: `needs-${dog.id}`,
        dogName: dog.name,
        type: "treatment",
        title: dog.special_needs,
        date: today.toISOString().slice(0, 10),
        status: "warning",
      });
    }
  });

  return records;
}

export const useHealthRecords = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["health_records", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("dogs")
        .select("id, name, vaccinations_up_to_date, is_neutered, special_needs, updated_at, created_at")
        .eq("owner_id", user.id);
      if (error) throw error;
      return buildRecordsFromDogs(data || []);
    },
    enabled: !!user,
  });
};
