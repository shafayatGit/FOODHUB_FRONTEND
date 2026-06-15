import OrdersList from "@/components/modules/Orders/OrdersList";
import { getCustomerOrders } from "@/services/orders.services";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getCustomerOrders();

  return <OrdersList orders={orders} />;
}
