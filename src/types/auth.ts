import type { Session, User } from "@supabase/supabase-js";

export type UserRole =
  | "fleet_manager"
  | "dispatcher"
  | "financial_analyst";

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}