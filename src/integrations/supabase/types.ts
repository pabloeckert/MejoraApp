export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip: string | null
          params: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip?: string | null
          params?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip?: string | null
          params?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_config: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      admin_whitelist: {
        Row: {
          added_by: string | null
          created_at: string | null
          email: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string | null
          email: string
        }
        Update: {
          added_by?: string | null
          created_at?: string | null
          email?: string
        }
        Relationships: []
      }
      business_mirror_results: {
        Row: {
          answers: Json
          completed_at: string
          id: string
          profile: string | null
          profile_data: Json | null
          score: number | null
          test_id: string
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          completed_at?: string
          id?: string
          profile?: string | null
          profile_data?: Json | null
          score?: number | null
          test_id: string
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          id?: string
          profile?: string | null
          profile_data?: Json | null
          score?: number | null
          test_id?: string
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_mirror_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "business_mirror_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      business_mirror_tests: {
        Row: {
          bg_color: string | null
          category: string
          color: string | null
          created_at: string
          description: string | null
          game_type: string
          icon: string | null
          id: string
          is_active: boolean | null
          min_access_level: Database["public"]["Enums"]["access_level"]
          profiles: Json | null
          questions: Json
          scoring_rules: Json | null
          slug: string
          sort_order: number | null
          subtitle: string | null
          time_estimate_min: number | null
          title: string
          updated_at: string
        }
        Insert: {
          bg_color?: string | null
          category: string
          color?: string | null
          created_at?: string
          description?: string | null
          game_type?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          min_access_level?: Database["public"]["Enums"]["access_level"]
          profiles?: Json | null
          questions: Json
          scoring_rules?: Json | null
          slug: string
          sort_order?: number | null
          subtitle?: string | null
          time_estimate_min?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          bg_color?: string | null
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          game_type?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          min_access_level?: Database["public"]["Enums"]["access_level"]
          profiles?: Json | null
          questions?: Json
          scoring_rules?: Json | null
          slug?: string
          sort_order?: number | null
          subtitle?: string | null
          time_estimate_min?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_categories: {
        Row: {
          activa: boolean
          created_at: string
          descripcion: string | null
          icono: string | null
          id: string
          nombre: string
          slug: string
        }
        Insert: {
          activa?: boolean
          created_at?: string
          descripcion?: string | null
          icono?: string | null
          id?: string
          nombre: string
          slug: string
        }
        Update: {
          activa?: boolean
          created_at?: string
          descripcion?: string | null
          icono?: string | null
          id?: string
          nombre?: string
          slug?: string
        }
        Relationships: []
      }
      content_guidelines: {
        Row: {
          category_id: string | null
          created_at: string
          ejemplos: string | null
          id: string
          instrucciones: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          ejemplos?: string | null
          id?: string
          instrucciones: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          ejemplos?: string | null
          id?: string
          instrucciones?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_guidelines_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      content_posts: {
        Row: {
          category_id: string | null
          contenido: string
          content_type: string
          created_at: string
          created_by: string | null
          estado: string
          fuente: string | null
          id: string
          imagen_url: string | null
          pdf_url: string | null
          published_at: string | null
          resumen: string | null
          scheduled_for: string | null
          titulo: string
          video_url: string | null
        }
        Insert: {
          category_id?: string | null
          contenido: string
          content_type?: string
          created_at?: string
          created_by?: string | null
          estado?: string
          fuente?: string | null
          id?: string
          imagen_url?: string | null
          pdf_url?: string | null
          published_at?: string | null
          resumen?: string | null
          scheduled_for?: string | null
          titulo: string
          video_url?: string | null
        }
        Update: {
          category_id?: string | null
          contenido?: string
          content_type?: string
          created_at?: string
          created_by?: string | null
          estado?: string
          fuente?: string | null
          id?: string
          imagen_url?: string | null
          pdf_url?: string | null
          published_at?: string | null
          resumen?: string | null
          scheduled_for?: string | null
          titulo?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_results: {
        Row: {
          created_at: string
          id: string
          perfil: string
          puntaje_total: number
          respuestas: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          perfil: string
          puntaje_total: number
          respuestas?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          perfil?: string
          puntaje_total?: number
          respuestas?: Json
          user_id?: string
        }
        Relationships: []
      }
      emergencies: {
        Row: {
          created_at: string
          id: string
          message: string | null
          sent_at: string | null
          user_id: string
          whatsapp_sent: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          sent_at?: string | null
          user_id: string
          whatsapp_sent?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          sent_at?: string | null
          user_id?: string
          whatsapp_sent?: boolean | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          attended_at: string | null
          event_id: string
          id: string
          registered_at: string
          status: string
          user_id: string
        }
        Insert: {
          attended_at?: string | null
          event_id: string
          id?: string
          registered_at?: string
          status?: string
          user_id: string
        }
        Update: {
          attended_at?: string | null
          event_id?: string
          id?: string
          registered_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string
          id: string
          image_url: string | null
          location: string | null
          max_attendees: number | null
          min_access_level: Database["public"]["Enums"]["access_level"]
          qr_code: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          location?: string | null
          max_attendees?: number | null
          min_access_level?: Database["public"]["Enums"]["access_level"]
          qr_code?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          location?: string | null
          max_attendees?: number | null
          min_access_level?: Database["public"]["Enums"]["access_level"]
          qr_code?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentor_conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mentor_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "mentor_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_comments_log: {
        Row: {
          action: string
          comment_id: string | null
          created_at: string | null
          id: string
          reason: string | null
        }
        Insert: {
          action: string
          comment_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          action?: string
          comment_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_comments_log_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "wall_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_log: {
        Row: {
          action: string
          created_at: string
          id: string
          post_id: string | null
          reason: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          post_id?: string | null
          reason?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          post_id?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_log_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "wall_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      novedades: {
        Row: {
          contenido: string | null
          created_at: string
          enlace_externo: string | null
          id: string
          imagen_url: string | null
          publicado: boolean
          published_at: string | null
          resumen: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          contenido?: string | null
          created_at?: string
          enlace_externo?: string | null
          id?: string
          imagen_url?: string | null
          publicado?: boolean
          published_at?: string | null
          resumen?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          contenido?: string | null
          created_at?: string
          enlace_externo?: string | null
          id?: string
          imagen_url?: string | null
          publicado?: boolean
          published_at?: string | null
          resumen?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      nps_responses: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          score: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          score: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      onboarding_emails: {
        Row: {
          email_type: string
          id: string
          sent_at: string
          user_id: string
        }
        Insert: {
          email_type: string
          id?: string
          sent_at?: string
          user_id: string
        }
        Update: {
          email_type?: string
          id?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          access_level_granted:
            | Database["public"]["Enums"]["access_level"]
            | null
          amount: number
          created_at: string
          currency: string
          external_id: string | null
          id: string
          notes: string | null
          payment_method: string | null
          period_end: string | null
          period_start: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_level_granted?:
            | Database["public"]["Enums"]["access_level"]
            | null
          amount: number
          created_at?: string
          currency?: string
          external_id?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_level_granted?:
            | Database["public"]["Enums"]["access_level"]
            | null
          amount?: number
          created_at?: string
          currency?: string
          external_id?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          apellido: string | null
          avatar_url: string | null
          bio: string | null
          birthday: string | null
          busca: string | null
          cargo: string | null
          created_at: string
          display_name: string | null
          email: string | null
          empresa: string | null
          empresa_tamano: string | null
          has_completed_diagnostic: boolean
          id: string
          last_badge_earned: string | null
          last_badge_earned_at: string | null
          linkedin: string | null
          membership_expires_at: string | null
          mirror_completed: boolean | null
          nickname: string | null
          nombre: string | null
          ofrece: string | null
          phone: string | null
          sector: string | null
          updated_at: string
          user_id: string
          visible_en_red: boolean | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          apellido?: string | null
          avatar_url?: string | null
          bio?: string | null
          birthday?: string | null
          busca?: string | null
          cargo?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          empresa?: string | null
          empresa_tamano?: string | null
          has_completed_diagnostic?: boolean
          id?: string
          last_badge_earned?: string | null
          last_badge_earned_at?: string | null
          linkedin?: string | null
          membership_expires_at?: string | null
          mirror_completed?: boolean | null
          nickname?: string | null
          nombre?: string | null
          ofrece?: string | null
          phone?: string | null
          sector?: string | null
          updated_at?: string
          user_id: string
          visible_en_red?: boolean | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          apellido?: string | null
          avatar_url?: string | null
          bio?: string | null
          birthday?: string | null
          busca?: string | null
          cargo?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          empresa?: string | null
          empresa_tamano?: string | null
          has_completed_diagnostic?: boolean
          id?: string
          last_badge_earned?: string | null
          last_badge_earned_at?: string | null
          linkedin?: string | null
          membership_expires_at?: string | null
          mirror_completed?: boolean | null
          nickname?: string | null
          nombre?: string | null
          ofrece?: string | null
          phone?: string | null
          sector?: string | null
          updated_at?: string
          user_id?: string
          visible_en_red?: boolean | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_slug: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_slug: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_slug?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wall_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          status: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          status?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wall_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "wall_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      wall_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wall_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "wall_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      wall_posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          id: string
          likes_count: number
          post_type: Database["public"]["Enums"]["post_type"]
          status: string
          user_id: string
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          post_type?: Database["public"]["Enums"]["post_type"]
          status?: string
          user_id: string
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          post_type?: Database["public"]["Enums"]["post_type"]
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      community_ranking: {
        Row: {
          activity_score: number | null
          badge_count: number | null
          comment_count: number | null
          display_name: string | null
          empresa: string | null
          post_count: number | null
          total_likes_received: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_and_award_badges: {
        Args: { p_user_id: string }
        Returns: {
          badge_name: string
          badge_slug: string
        }[]
      }
      get_users_needing_onboarding_email: {
        Args: never
        Returns: {
          email: string
          email_type: string
          nombre: string
          signup_date: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { user_uuid: string }; Returns: boolean }
    }
    Enums: {
      access_level: "N0" | "N1" | "N2" | "ADMIN"
      app_role: "admin" | "moderator" | "user"
      client_status: "activo" | "potencial" | "inactivo"
      currency_code: "ARS" | "USD" | "EUR"
      followup_scenario: "vinculado" | "independiente" | "historico"
      interaction_medium:
        | "whatsapp"
        | "llamada"
        | "email"
        | "reunion_presencial"
        | "reunion_virtual"
        | "md_instagram"
        | "md_facebook"
        | "md_linkedin"
        | "visita_campo"
      interaction_result:
        | "presupuesto"
        | "venta"
        | "seguimiento"
        | "sin_respuesta"
        | "no_interesado"
      negotiation_state:
        | "con_interes"
        | "sin_respuesta"
        | "revisando"
        | "pidio_cambios"
      post_type: "consulta" | "caso" | "convocatoria"
      quote_path: "catalogo" | "adjunto"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_level: ["N0", "N1", "N2", "ADMIN"],
      app_role: ["admin", "moderator", "user"],
      client_status: ["activo", "potencial", "inactivo"],
      currency_code: ["ARS", "USD", "EUR"],
      followup_scenario: ["vinculado", "independiente", "historico"],
      interaction_medium: [
        "whatsapp",
        "llamada",
        "email",
        "reunion_presencial",
        "reunion_virtual",
        "md_instagram",
        "md_facebook",
        "md_linkedin",
        "visita_campo",
      ],
      interaction_result: [
        "presupuesto",
        "venta",
        "seguimiento",
        "sin_respuesta",
        "no_interesado",
      ],
      negotiation_state: [
        "con_interes",
        "sin_respuesta",
        "revisando",
        "pidio_cambios",
      ],
      post_type: ["consulta", "caso", "convocatoria"],
      quote_path: ["catalogo", "adjunto"],
    },
  },
} as const
