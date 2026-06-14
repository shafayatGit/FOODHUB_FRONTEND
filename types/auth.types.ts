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

  