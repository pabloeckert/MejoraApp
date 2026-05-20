/**
 * useProfile — Hook for user profile data with React Query caching
 *
 * Replaces direct Supabase calls in Index.tsx and other components.
 * Provides profile completeness check and profile data.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProfileData {
  empresa: string | null;
  cargo: string | null;
  phone: string | null;
  nombre: string | null;
  apellido: string | null;
  display_name: string | null;
  has_completed_diagnostic: boolean;
  access_level: string | null;
  nickname: string | null;
  whatsapp: string | null;
  birthday: string | null;
  membership_expires_at: string | null;
  avatar_url: string | null;
  bio: string | null;
  linkedin: string | null;
  website: string | null;
  mirror_completed: boolean | null;
  ofrece: string | null;
  busca: string | null;
  sector: string | null;
  empresa_tamano: string | null;
  visible_en_red: boolean | null;
}

async function fetchProfile(userId: string): Promise<ProfileData> {
  const { data, error } = await supabase
    .from("profiles")
    .select("empresa, cargo, phone, nombre, apellido, display_name, has_completed_diagnostic, access_level, nickname, whatsapp, birthday, membership_expires_at, avatar_url, bio, linkedin, website, mirror_completed, ofrece, busca, sector, empresa_tamano, visible_en_red")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  // Columnas nuevas (migración 20260520) — actualizar con `supabase gen types` post-migración
  return data as unknown as ProfileData;
}

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 min — profile doesn't change often
    retry: 1,
  });
}

export function useProfileComplete(userId: string | undefined) {
  const { data, isLoading } = useProfile(userId);
  const isComplete = data ? !!(data.empresa || data.cargo) : null;
  return { isComplete, isLoading, profile: data };
}
