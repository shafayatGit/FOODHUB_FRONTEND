import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getNavItemsByRole } from "@/lib/navItems/navItems";
import { getUserInfo } from "@/services/auth.services";


import { NavSection } from "@/types/dashboard.types";
import DashboardNavbarContent from "./DashboardNavbarContent";

const DashboardNavbar = async () => {
  const userInfo = await getUserInfo();
  const role = userInfo?.role ?? "CUSTOMER";
  const navItems: NavSection[] = getNavItemsByRole(role);

  const dashboardHome = getDefaultDashboardRoute(role);
  return (
    <DashboardNavbarContent
      userInfo={
        userInfo ?? {
          id: "",
          name: "Customer",
          email: "",
          role: "CUSTOMER",
        }
      }
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardNavbar;
