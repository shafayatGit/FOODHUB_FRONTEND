export interface CartItem {
  mealId: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  providerId: string;
  providerName?: string;
  categoryName?: string;
  dietaryPreference?: string;
  imageUrl?: string;
}

export interface CartTotals {
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}
