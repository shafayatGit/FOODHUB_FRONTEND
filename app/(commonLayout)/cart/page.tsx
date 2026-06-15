import CartPageContent from "@/components/modules/Cart/CartPageContent";
import { getUserInfo } from "@/services/auth.services";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const userInfo = await getUserInfo();

  return <CartPageContent userInfo={userInfo} />;
}
