export interface ILoginResponse {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image: string | null;
    } 
}

export type UserRole = "ADMIN" | "CUSTOMER" | "PROVIDER";

export interface IRegisterResponse {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string | null;
    createdAt: string;
    token: string;
}
  