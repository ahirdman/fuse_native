import type { PostgrestError } from '@supabase/supabase-js';

import type { Database } from './database-generated.types';
export type { Database } from './database-generated.types';

import type { FuseTagWithSubTags } from 'fuse/queries/getFuseLists';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
  ? Exclude<U, null>
  : never;
export type DbResultErr = PostgrestError;

export type UntionTagTable = Omit<Tables<"tags">, "type"> & { type: "tag" }
export type UntionFuseTable = Omit<FuseTagWithSubTags, "type"> & { type: "fuse" };

export type TagOrFuseEntry = 
  | UntionTagTable
  | UntionFuseTable
