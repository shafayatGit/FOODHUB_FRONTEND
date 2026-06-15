import OrderManagementTable from "@/components/modules/Admin/OrderManagementTable";
import AppPagination from "@/components/shared/AppPagination";
import { getAdminOrders } from "@/services/admin-orders.services";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const AdminOrderPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = typeof params.page === "string" ? params.page : "1";
  const { orders, meta } = await getAdminOrders({ page });

  return (
    <div className="space-y-4">
      <OrderManagementTable orders={orders} />
      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        {meta && <AppPagination meta={meta} />}
      </div>
    </div>
  );
};

export default AdminOrderPage;
