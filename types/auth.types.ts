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

export type UserRole = "ADMIN" | "DOCTOR" | "PATIENT";


 export interface IRegisterResponse{
     id: string,
    name: string,
    email: string,
    role: UserRole,
    createdAt: string,
    token: string,
}
  