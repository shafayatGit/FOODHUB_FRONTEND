export type AdminOrderStatus =
  | "PLACED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED"
  | "UNKNOWN";

export interface AdminOrder {
  id: string;
  customerName: string;
  providerName: string;
  status: AdminOrderStatus;
  totalAmount: number;
  createdAt?: string;
}
