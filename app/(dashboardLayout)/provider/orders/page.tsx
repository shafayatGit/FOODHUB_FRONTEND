import ProviderOrdersContent from "@/components/modules/Provider/ProviderOrdersContent";
import AppPagination from "@/components/shared/AppPagination";
import { getProviderOrders } from "@/services/provider-dashboard.services";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

const ProviderOrdersPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = typeof params.page === "string" ? params.page : "1";
  const { orders, meta } = await getProviderOrders({ page, limit: 10 });

  return (
    <div className="space-y-4">
      <ProviderOrdersContent orders={orders} />
      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        {meta && <AppPagination meta={meta} />}
      </div>
    </div>
  );
};

export default ProviderOrdersPage;
