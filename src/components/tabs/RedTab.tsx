import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Search, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────

interface RedMember {
  id: string;
  nombre: string | null;
  apellido: string | null;
  empresa: string | null;
  sector: string | null;
  ofrece: string | null;
  busca: string | null;
  empresa_tamano: string | null;
  avatar_url: string | null;
  display_name: string | null;
}

// ── Data ────────────────────────────────────────────────────────

async function fetchRedMembers(): Promise<RedMember[]> {
  // Columnas nuevas (migración 20260520) — actualizar con `supabase gen types` post-migración
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nombre, apellido, empresa, sector, ofrece, busca, empresa_tamano, avatar_url, display_name")
    .filter("visible_en_red", "eq", true)
    .filter("mirror_completed", "eq", true)
    .order("nombre", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as RedMember[];
}

function useRedMembers() {
  return useQuery({
    queryKey: ["red-members"],
    queryFn: fetchRedMembers,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

// ── Avatar ──────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-600", "bg-purple-600", "bg-emerald-600", "bg-red-600",
  "bg-amber-600", "bg-cyan-600", "bg-rose-600", "bg-indigo-600",
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(nombre?: string | null, apellido?: string | null) {
  return ((nombre?.charAt(0) ?? "") + (apellido?.charAt(0) ?? "")).toUpperCase() || "?";
}

// ── Member Card ─────────────────────────────────────────────────

function MemberCardRed({ member }: { member: RedMember }) {
  const displayName =
    member.display_name ||
    `${member.nombre ?? ""} ${member.apellido ?? ""}`.trim() ||
    "Líder";
  const initials = getInitials(member.nombre, member.apellido);
  const avatarColor = getAvatarColor(member.id);

  return (
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0", avatarColor)}>
          {member.avatar_url ? (
            <img src={member.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{displayName}</p>
          {member.empresa && (
            <p className="text-caption text-muted-foreground truncate">{member.empresa}</p>
          )}
        </div>
        {member.sector && (
          <span className="shrink-0 text-caption px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {member.sector}
          </span>
        )}
      </div>

      {/* Ofrece / Busca */}
      {(member.ofrece || member.busca) && (
        <div className="space-y-1.5 text-sm">
          {member.ofrece && (
            <p className="text-foreground/80 line-clamp-2">
              <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mr-1">Ofrece:</span>
              {member.ofrece}
            </p>
          )}
          {member.busca && (
            <p className="text-foreground/80 line-clamp-2">
              <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mr-1">Busca:</span>
              {member.busca}
            </p>
          )}
        </div>
      )}

      {/* empresa_tamano */}
      {member.empresa_tamano && (
        <p className="text-caption text-muted-foreground">{member.empresa_tamano} empleados</p>
      )}
    </div>
  );
}

// ── Main Tab ────────────────────────────────────────────────────

export function RedTab() {
  const { user } = useAuth();
  const { data: userProfile } = useProfile(user?.id);
  const { data: members = [], isLoading, error } = useRedMembers();

  const [search, setSearch] = useState("");
  const [filterSector, setFilterSector] = useState("");
  const [filterTamano, setFilterTamano] = useState("");

  const sectors = useMemo(() => {
    const set = new Set(members.map((m) => m.sector).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [members]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      const name = `${m.nombre ?? ""} ${m.apellido ?? ""} ${m.display_name ?? ""} ${m.empresa ?? ""}`.toLowerCase();
      if (q && !name.includes(q) && !m.ofrece?.toLowerCase().includes(q) && !m.busca?.toLowerCase().includes(q)) return false;
      if (filterSector && m.sector !== filterSector) return false;
      if (filterTamano && m.empresa_tamano !== filterTamano) return false;
      return true;
    });
  }, [members, search, filterSector, filterTamano]);

  const showProfileBanner =
    userProfile?.mirror_completed === true &&
    (!userProfile?.ofrece || !userProfile?.busca);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <AlertCircle className="w-8 h-8 text-destructive" />
        <p className="text-sm text-muted-foreground">No se pudo cargar la Red. Intentá de nuevo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-bold text-foreground text-base">
          {members.length} {members.length === 1 ? "líder" : "líderes"} en la Red
        </h2>
      </div>

      {/* Banner perfil incompleto */}
      {showProfileBanner && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 p-3">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Completá tu perfil con <strong>qué ofrecés</strong> y <strong>qué buscás</strong> para aparecer en la Red.
          </p>
        </div>
      )}

      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder="Buscar por nombre, empresa, ofrece, busca…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <select
          value={filterSector}
          onChange={(e) => setFilterSector(e.target.value)}
          className="flex-1 text-sm rounded-lg border border-input bg-background px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
        >
          <option value="">Todos los sectores</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filterTamano}
          onChange={(e) => setFilterTamano(e.target.value)}
          className="flex-1 text-sm rounded-lg border border-input bg-background px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
        >
          <option value="">Tamaño empresa</option>
          {["1-10", "10-50", "50-200", "200+"].map((t) => (
            <option key={t} value={t}>{t} empleados</option>
          ))}
        </select>
      </div>

      {/* Grid de miembros */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          {search || filterSector || filterTamano
            ? "Sin resultados para ese filtro."
            : "Todavía no hay líderes en la Red."}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((member) => (
            <MemberCardRed key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RedTab;
