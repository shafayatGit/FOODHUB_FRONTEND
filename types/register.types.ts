export interface IRegisterCustomerPayload {
  name: string;
  email: string;
  password: string;
  role: "customer";
}

export interface IRegisterProviderPayload {
  name: string;
  email: string;
  password: string;
  role: "provider";
  restaurantName: string;
  description?: string;
  address: string;
  isOpen?: boolean;
  openTime?: string | null;
  closeTime?: string | null;
}

export type IRegisterPayload = IRegisterCustomerPayload | IRegisterProviderPayload;
