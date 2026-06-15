import ProviderMealsContent from "@/components/modules/Provider/ProviderMealsContent";
import { getMyProviderProfile } from "@/services/provider-dashboard.services";
import { getCategories } from "@/services/categories.services";

export const dynamic = "force-dynamic";

const ProviderMealsPage = async () => {
  const providerProfile = await getMyProviderProfile();
  const { categories } = await getCategories({ limit: 100 });

  if (!providerProfile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-semibold text-destructive">Profile Not Found</h2>
        <p className="mt-2 text-muted-foreground max-w-md">
          Unable to load provider profile. Please make sure you are registered as a provider and logged in.
        </p>
      </div>
    );
  }

  return (
    <ProviderMealsContent
      providerProfile={providerProfile}
      categories={categories}
    />
  );
};

export default ProviderMealsPage;
