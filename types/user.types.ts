export type UserRole =  "ADMIN" | "CUSTOMER" | "PROVIDER";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}