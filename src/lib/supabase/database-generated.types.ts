export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      fuseTags: {
        Row: {
          created_at: string
          id: number
          latest_snapshot_id: string | null
          spotify_playlist_id: string | null
          spotify_playlist_uri: string | null
          synced_at: string | null
          tag_id_1: number
          tag_id_2: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          latest_snapshot_id?: string | null
          spotify_playlist_id?: string | null
          spotify_playlist_uri?: string | null
          synced_at?: string | null
          tag_id_1: number
          tag_id_2: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          latest_snapshot_id?: string | null
          spotify_playlist_id?: string | null
          spotify_playlist_uri?: string | null
          synced_at?: string | null
          tag_id_1?: number
          tag_id_2?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_fuseTags_tag_id_1_fkey"
            columns: ["tag_id_1"]
            isOneToOne: false
            referencedRelation: "initial_tags_with_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_fuseTags_tag_id_1_fkey"
            columns: ["tag_id_1"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_fuseTags_tag_id_1_fkey"
            columns: ["tag_id_1"]
            isOneToOne: false
            referencedRelation: "tags_with_track_ids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_fuseTags_tag_id_2_fkey"
            columns: ["tag_id_2"]
            isOneToOne: false
            referencedRelation: "initial_tags_with_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_fuseTags_tag_id_2_fkey"
            columns: ["tag_id_2"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_fuseTags_tag_id_2_fkey"
            columns: ["tag_id_2"]
            isOneToOne: false
            referencedRelation: "tags_with_track_ids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_fuseTags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          app_user_id: string | null
          billing_issue_at: string | null
          created_at: string
          expiration_date: string | null
          id: string
          is_active: boolean
          is_sandbox: boolean
          product_id: string
          unsubscribed_at: string | null
          user_id: string
          will_renew: boolean
        }
        Insert: {
          app_user_id?: string | null
          billing_issue_at?: string | null
          created_at?: string
          expiration_date?: string | null
          id?: string
          is_active: boolean
          is_sandbox: boolean
          product_id: string
          unsubscribed_at?: string | null
          user_id?: string
          will_renew: boolean
        }
        Update: {
          app_user_id?: string | null
          billing_issue_at?: string | null
          created_at?: string
          expiration_date?: string | null
          id?: string
          is_active?: boolean
          is_sandbox?: boolean
          product_id?: string
          unsubscribed_at?: string | null
          user_id?: string
          will_renew?: boolean
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string
          created_at: string
          id: number
          latest_snapshot_id: string | null
          name: string
          spotify_playlist_id: string | null
          spotify_playlist_uri: string | null
          synced_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: number
          latest_snapshot_id?: string | null
          name: string
          spotify_playlist_id?: string | null
          spotify_playlist_uri?: string | null
          synced_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: number
          latest_snapshot_id?: string | null
          name?: string
          spotify_playlist_id?: string | null
          spotify_playlist_uri?: string | null
          synced_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          album: string | null
          album_covers: string[] | null
          artist: string | null
          duration: number
          explicit: boolean
          id: string
          name: string | null
          uri: string
        }
        Insert: {
          album?: string | null
          album_covers?: string[] | null
          artist?: string | null
          duration: number
          explicit?: boolean
          id: string
          name?: string | null
          uri?: string
        }
        Update: {
          album?: string | null
          album_covers?: string[] | null
          artist?: string | null
          duration?: number
          explicit?: boolean
          id?: string
          name?: string | null
          uri?: string
        }
        Relationships: []
      }
      trackTags: {
        Row: {
          created_at: string
          id: number
          tag_id: number
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          tag_id: number
          track_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          tag_id?: number
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_trackTags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackTags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "initial_tags_with_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackTags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackTags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags_with_track_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: string
          spotify_refresh_token: string | null
          spotify_token_data: Json | null
          spotify_user_id: string | null
          subscription: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          spotify_refresh_token?: string | null
          spotify_token_data?: Json | null
          spotify_user_id?: string | null
          subscription?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          spotify_refresh_token?: string | null
          spotify_token_data?: Json | null
          spotify_user_id?: string | null
          subscription?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_subscription_fkey"
            columns: ["subscription"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      initial_tags_with_matches: {
        Row: {
          color: string | null
          id: number | null
          name: string | null
        }
        Relationships: []
      }
      matched_tags: {
        Row: {
          color: string | null
          id: number | null
          initial_tag_id: number | null
          name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trackTags_tag_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackTags_tag_id_fkey"
            columns: ["initial_tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackTags_tag_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "initial_tags_with_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackTags_tag_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "tags_with_track_ids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackTags_tag_id_fkey"
            columns: ["initial_tag_id"]
            isOneToOne: false
            referencedRelation: "initial_tags_with_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackTags_tag_id_fkey"
            columns: ["initial_tag_id"]
            isOneToOne: false
            referencedRelation: "tags_with_track_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      tags_with_track_ids: {
        Row: {
          color: string | null
          created_at: string | null
          id: number | null
          name: string | null
          track_ids: string[] | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      track_tags_view: {
        Row: {
          track_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      change_user_password: {
        Args: {
          current_plain_password: string
          new_plain_password: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
