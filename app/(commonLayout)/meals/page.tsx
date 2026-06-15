import MealFilters from "@/components/modules/Meals/MealFilters";
import MealsGridWithSort from "@/components/modules/Meals/MealsGridWithSort";
import AppPagination from "@/components/shared/AppPagination";
import { getMeals } from "@/services/meals.services";

export const dynamic = "force-dynamic";

type MealsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

const MealsPage = async ({ searchParams }: MealsPageProps) => {
  const params = await searchParams;
  const currentParams = {
    page: getParam(params, "page") ?? "1",
    limit: getParam(params, "limit") ?? "9",
    searchTerm: getParam(params, "searchTerm"),
    dietaryPreference: getParam(params, "dietaryPreference"),
    minPrice: getParam(params, "minPrice"),
    maxPrice: getParam(params, "maxPrice"),
    sortBy: getParam(params, "sortBy") ?? "newest",
  };
  const { meals, meta } = await getMeals(currentParams);

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Fresh from local kitchens</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-5xl">
              Browse Meals
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Find available dishes by provider, price, category, and dietary preference.
            </p>
          </div>
          <div className="rounded-3xl bg-card px-4 py-3 text-sm shadow-sm ring-1 ring-foreground/5">
            <span className="text-muted-foreground">Showing </span>
            <span className="font-semibold">{meals.length}</span>
            <span className="text-muted-foreground"> meals</span>
          </div>
        </div>

        <MealFilters
          searchTerm={currentParams.searchTerm}
          dietaryPreference={currentParams.dietaryPreference}
          minPrice={currentParams.minPrice}
          maxPrice={currentParams.maxPrice}
          sortBy={currentParams.sortBy}
        />
        <MealsGridWithSort meals={meals} sortBy={currentParams.sortBy} />
        {meta && <AppPagination meta={meta} />}
      </div>
    </section>
  )
}

export default MealsPage
