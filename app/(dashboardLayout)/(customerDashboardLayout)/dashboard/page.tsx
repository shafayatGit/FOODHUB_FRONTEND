import CustomerDashboardContent from "@/components/modules/Customer/CustomerDashboardContent";
import { getUserInfo } from "@/services/auth.services";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  const userInfo = await getUserInfo();

  return <CustomerDashboardContent userInfo={userInfo} />;
}

export default DashboardPage
