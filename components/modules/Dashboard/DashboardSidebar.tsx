
import {getUserInfo} from "@/services/auth.services";
import { NavSection } from "@/types/dashboard.types";
import DashboardSidebarContent from "./DashboardSidebarContent";
import getDefaultDashboardRoute from "@/lib/authUtils";
import {getNavItemsByRole} from "@/lib/navItems/navItems";


const DashboardSidebar = async () => {
  const userInfo = await getUserInfo();

  if (!userInfo) return null; // no session - nothing to render server-side

  const role = (userInfo.role || "CUSTOMER").toString().toUpperCase();
  const navItems: NavSection[] = getNavItemsByRole(role);

  const dashboardHome = getDefaultDashboardRoute(role);

  return (
    <DashboardSidebarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardSidebar;
