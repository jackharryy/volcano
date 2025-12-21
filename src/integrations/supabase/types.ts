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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      problems: {
        Row: {
          assignee_email: string | null
          assignee_id: string | null
          assignee_name: string | null
          category: string | null
          created_at: string
          description: string
          id: string
          organization_id: string
          priority: string | null
          reporter_email: string | null
          reporter_name: string | null
          status: string | null
          team_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assignee_email?: string | null
          assignee_id?: string | null
          assignee_name?: string | null
          category?: string | null
          created_at?: string
          description: string
          id?: string
          organization_id: string
          priority?: string | null
          reporter_email?: string | null
          reporter_name?: string | null
          status?: string | null
          team_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assignee_email?: string | null
          assignee_id?: string | null
          assignee_name?: string | null
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          organization_id?: string
          priority?: string | null
          reporter_email?: string | null
          reporter_name?: string | null
          status?: string | null
          team_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "problems_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problems_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problems_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_comments: {
        Row: {
          body: string
          created_at: string
          id: string
          parent_comment_id: string | null
          problem_id: string
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          problem_id: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          problem_id?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problem_comments_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_events: {
        Row: {
          actor_email: string | null
          actor_id: string | null
          actor_name: string | null
          created_at: string
          event_type: string
          id: string
          payload: Json | null
          problem_id: string
        }
        Insert: {
          actor_email?: string | null
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          event_type: string
          id?: string
          payload?: Json | null
          problem_id: string
        }
        Update: {
          actor_email?: string | null
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json | null
          problem_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_events_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_attachments: {
        Row: {
          content_type: string
          created_at: string
          filename: string
          id: string
          problem_id: string
          storage_path: string
        }
        Insert: {
          content_type: string
          created_at?: string
          filename: string
          id?: string
          problem_id: string
          storage_path: string
        }
        Update: {
          content_type?: string
          created_at?: string
          filename?: string
          id?: string
          problem_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_attachments_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_comment_reactions: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          reaction_type: string
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          reaction_type: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problem_comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "problem_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_comment_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_teams: {
        Row: {
          id: string
          problem_id: string
          team_id: string
        }
        Insert: {
          id?: string
          problem_id: string
          team_id: string
        }
        Update: {
          id?: string
          problem_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_teams_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          id: string
          joined_at: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          invite_code: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          invite_code: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          invite_code?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          organization_id: string
          color: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          organization_id: string
          color?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          organization_id?: string
          color?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      join_organization: {
        Args: {
          invite_code: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
