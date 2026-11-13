/** Shared types for Muro components */

export type PostType = "consulta" | "caso" | "convocatoria";

export const WALL_CATEGORIES = [
  "Finanzas",
  "Socios",
  "Comercial",
  "Equipo",
  "Crisis",
] as const;

export type WallCategory = (typeof WALL_CATEGORIES)[number];

export interface WallPost {
  id: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  status: string;
  post_type: PostType;
}

export const POST_TYPE_CONFIG: Record<PostType, { label: string; emoji: string; color: string; bgColor: string }> = {
  consulta: {
    label: "Consulta",
    emoji: "❓",
    color: "text-[#1A3D84] dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  caso: {
    label: "Caso",
    emoji: "📋",
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  convocatoria: {
    label: "Convocatoria",
    emoji: "📢",
    color: "text-amber-800 dark:text-amber-300",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
};
