import OrderManagementTable from "@/components/modules/Admin/OrderManagementTable";
import { getAdminOrders } from "@/services/admin-orders.services";

const AdminOrderPage = async () => {
  const orders = await getAdminOrders();

  return <OrderManagementTable orders={orders} />;
};

export default AdminOrderPage;
