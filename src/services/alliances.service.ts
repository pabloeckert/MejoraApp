/**
 * alliances.service.ts — Capa de servicios B2B para Círculo Dorado (N2)
 *
 * Opera sobre las tablas public.alliances y public.alliance_interests,
 * e invoca el matchmaking semántico vía Edge Function match-alliances.
 */
import { supabase } from "@/integrations/supabase/client";

export type AllianceAxis =
  | "Distribución"
  | "Capacidad Instalada"
  | "Inversión Conjunta"
  | "Proveedores B2B";

export interface AllianceOpportunity {
  id: string;
  user_id: string;
  axis: AllianceAxis;
  title: string;
  ofrece: string | null;
  busca: string | null;
  region: string | null;
  status: string;
  created_at: string;
  author_name?: string;
  author_company?: string | null;
  author_sector?: string | null;
}

export interface AllianceMatchSuggestion {
  allianceId: string;
  score: number;
  reason: string;
}

export async function fetchActiveAlliances(): Promise<AllianceOpportunity[]> {
  const { data: rows, error } = await supabase
    .from("alliances")
    .select("id, user_id, axis, title, ofrece, busca, region, status, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) throw error;
  const list = (rows ?? []) as AllianceOpportunity[];
  if (list.length === 0) return [];

  const userIds = Array.from(new Set(list.map((r) => r.user_id)));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, nombre, apellido, display_name, empresa, sector")
    .in("user_id", userIds);

  const profileMap = new Map<string, { name: string; company: string | null; sector: string | null }>();
  for (const p of profiles ?? []) {
    const name =
      p.display_name ||
      `${p.nombre ?? ""} ${p.apellido ?? ""}`.trim() ||
      "Decisor Círculo Dorado";
    profileMap.set(p.user_id, {
      name,
      company: p.empresa ?? null,
      sector: p.sector ?? null,
    });
  }

  return list.map((item) => {
    const meta = profileMap.get(item.user_id);
    return {
      ...item,
      author_name: meta?.name ?? "Decisor Círculo Dorado",
      author_company: meta?.company ?? null,
      author_sector: meta?.sector ?? null,
    };
  });
}

export async function createAllianceOpportunity(params: {
  userId: string;
  axis: AllianceAxis;
  title: string;
  ofrece?: string | null;
  busca?: string | null;
  region?: string | null;
}): Promise<AllianceOpportunity> {
  const { data, error } = await supabase
    .from("alliances")
    .insert({
      user_id: params.userId,
      axis: params.axis,
      title: params.title.trim(),
      ofrece: params.ofrece?.trim() || null,
      busca: params.busca?.trim() || null,
      region: params.region?.trim() || null,
      status: "active",
    })
    .select("id, user_id, axis, title, ofrece, busca, region, status, created_at")
    .single();

  if (error) throw error;
  return data as AllianceOpportunity;
}

export async function closeAllianceOpportunity(allianceId: string): Promise<void> {
  const { error } = await supabase
    .from("alliances")
    .update({ status: "closed", updated_at: new Date().toISOString() })
    .eq("id", allianceId);

  if (error) throw error;
}

export async function fetchRequestedAllianceIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("alliance_interests")
    .select("alliance_id")
    .eq("requester_user_id", userId);

  if (error) return new Set();
  return new Set((data ?? []).map((r) => r.alliance_id));
}

export async function expressAllianceInterest(params: {
  allianceId: string;
  userId: string;
  note?: string;
}): Promise<void> {
  const { error } = await supabase.from("alliance_interests").insert({
    alliance_id: params.allianceId,
    requester_user_id: params.userId,
    note: params.note?.trim() || null,
  });

  // Ignore duplicate express attempt (unique constraint 23505)
  if (error && error.code !== "23505") {
    throw error;
  }
}

export async function fetchAllianceMatches(): Promise<AllianceMatchSuggestion[]> {
  const { data, error } = await supabase.functions.invoke("match-alliances", {
    body: {},
  });

  if (error) throw error;
  return (data?.matches ?? []) as AllianceMatchSuggestion[];
}
