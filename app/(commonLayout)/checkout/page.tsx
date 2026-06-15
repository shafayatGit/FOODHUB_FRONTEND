import CheckoutContent from "@/components/modules/Checkout/CheckoutContent";
import { getUserInfo } from "@/services/auth.services";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const userInfo = await getUserInfo();

  return <CheckoutContent userInfo={userInfo} />;
}
