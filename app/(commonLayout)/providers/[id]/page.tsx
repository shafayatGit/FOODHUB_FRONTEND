import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import MealsGrid from "@/components/modules/Meals/MealsGrid";
import ProviderHero from "@/components/modules/Providers/ProviderHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProviderById } from "@/services/providers.services";

export const dynamic = "force-dynamic";

type ProviderPageProps = {
  params: Promise<{ id: string }>;
};

const ProviderPage = async ({ params }: ProviderPageProps) => {
  const { id } = await params;
  const provider = await getProviderById(id);

  if (!provider) {
    return (
      <section className="grid min-h-[70svh] place-items-center bg-muted/30 px-4 py-10">
        <Card className="max-w-md border-0 text-center shadow-sm">
          <CardHeader>
            <CardTitle>Provider not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This restaurant profile is not available right now.
            </p>
            <Button asChild>
              <Link href="/meals">Browse meals</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/meals">
            <ArrowLeft className="size-4" />
            Back to meals
          </Link>
        </Button>
        <ProviderHero provider={provider} />
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Restaurant menu</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">
                Meals by {provider.restaurantName}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {provider.meals?.length ?? 0} meals available from this provider
            </p>
          </div>
          <MealsGrid meals={provider.meals ?? []} />
        </section>
      </div>
    </section>
  );
};

export default ProviderPage
