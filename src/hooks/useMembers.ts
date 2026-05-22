/**
 * useMembers — Hook for community member directory
 *
 * Fetches profiles for the Comunidad tab.
 * Supports filtering by sector and search by name.
 *
 * Note: community_challenges and challenge_participants tables do not exist
 * in the current schema. Those hooks return empty/no-op until the tables
 * are created via migration.
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CommunityMember {
  id: string;
  nombre: string | null;
  apellido: string | null;
  display_name: string | null;
  empresa: string | null;
  cargo: string | null;
  bio: string | null;
  sector: string | null;
  linkedin: string | null;
  avatar_url: string | null;
  badge_count: number;
  post_count: number;
  total_likes: number;
}

interface UseMembersOptions {
  limit?: number;
  industry?: string;
  search?: string;
  featured?: boolean;
}

export function useMembers(options: UseMembersOptions = {}) {
  const { limit = 20, industry, search, featured } = options;
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchMembers = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("profiles")
      .select("id, nombre, apellido, display_name, empresa, cargo, bio, sector, linkedin, avatar_url", { count: "exact" })
      .order("nombre", { ascending: true });

    if (industry && industry !== "all") {
      query = query.eq("sector", industry);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(
        `nombre.ilike.${term},apellido.ilike.${term},display_name.ilike.${term},empresa.ilike.${term}`
      );
    }

    query = query.limit(featured ? 3 : limit);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    } else {
      setMembers(
        (data ?? []).map((row) => ({
          ...row,
          badge_count: 0,
          post_count: 0,
          total_likes: 0,
        }))
      );
      setTotalCount(count ?? 0);
    }

    setLoading(false);
  }, [limit, industry, search, featured]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, totalCount, refetch: fetchMembers };
}

/**
 * useMemberProfile — Fetch a single member's profile by auth user id
 */
export function useMemberProfile(userId: string | null) {
  const [profile, setProfile] = useState<CommunityMember | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    supabase
      .from("profiles")
      .select("id, nombre, apellido, display_name, empresa, cargo, bio, sector, linkedin, avatar_url")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching member profile:", error);
          setProfile(null);
        } else {
          setProfile(data ? { ...data, badge_count: 0, post_count: 0, total_likes: 0 } : null);
        }
        setLoading(false);
      });
  }, [userId]);

  return { profile, loading };
}

/**
 * useChallenges — community_challenges table does not exist yet.
 * Returns empty until a migration creates it.
 */
export interface CommunityChallenge {
  id: string;
  title: string;
  description: string | null;
  challenge_type: string;
  start_date: string;
  end_date: string;
  participant_count: number;
}

export function useChallenges() {
  return { challenges: [] as CommunityChallenge[], loading: false };
}

/**
 * useChallengeParticipation — challenge_participants table does not exist yet.
 * Returns no-op until a migration creates it.
 */
export function useChallengeParticipation(_challengeId: string, _userId?: string) {
  return {
    joined: false,
    loading: false,
    toggleJoin: async () => {},
  };
}
