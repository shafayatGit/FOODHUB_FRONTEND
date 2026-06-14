export interface ILoginResponse {
    success: boolean;
  message: string;
  data:{
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image: string | null;
    }
  }
  
}

  