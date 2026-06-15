import type { UserRole } from "./user.types";

export type AdminUserStatus = "ACTIVE" | "SUSPENDED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AdminUserStatus;
  createdAt?: string;
  phone?: string | null;
}
