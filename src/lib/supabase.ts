import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our schema
export interface Event {
  id: string;
  name: string;
  created_at: string;
}

export interface EventOccurrence {
  id: string;
  event_id: string;
  created_at: string;
}

export interface EventWithCount extends Event {
  count: number;
}
