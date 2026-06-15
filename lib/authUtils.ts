export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export function getDefaultDashboardRoute(role: string): string {
  const r = (role || "CUSTOMER").toString().toUpperCase();

  switch (r) {
    case "ADMIN":
      return "/admin/dashboard";
    case "PROVIDER":
      return "/provider/dashboard";
    case "CUSTOMER":
    default:
      return "/dashboard";
  }
}

export default getDefaultDashboardRoute;
