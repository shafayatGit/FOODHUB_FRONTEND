import CategoryManagement from "@/components/modules/Admin/CategoryManagement";
import AppPagination from "@/components/shared/AppPagination";
import { getCategories } from "@/services/categories.services";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const CategoryManagementPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = typeof params.page === "string" ? params.page : "1";
  const { categories, meta } = await getCategories({ page });

  return (
    <div className="space-y-4">
      <CategoryManagement categories={categories} />
      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        {meta && <AppPagination meta={meta} />}
      </div>
    </div>
  );
};

export default CategoryManagementPage;
