import Link from "next/link";

import OrderDetails from "@/components/modules/Orders/OrderDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCustomerOrderById } from "@/services/orders.services";

export const dynamic = "force-dynamic";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params;
  const order = await getCustomerOrderById(id);

  if (!order) {
    return (
      <section className="grid min-h-[70svh] place-items-center bg-muted/30 px-4 py-10">
        <Card className="max-w-md border-0 text-center shadow-sm">
          <CardHeader>
            <CardTitle>Order not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This order is unavailable or may have been removed.
            </p>
            <Button asChild>
              <Link href="/orders">Back to orders</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return <OrderDetails order={order} />;
}
