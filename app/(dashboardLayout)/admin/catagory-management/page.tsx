import CategoryManagement from "@/components/modules/Admin/CategoryManagement";
import { getCategories } from "@/services/categories.services";

const CategoryManagementPage = async () => {
  const categories = await getCategories();

  return <CategoryManagement categories={categories} />;
};

export default CategoryManagementPage;
