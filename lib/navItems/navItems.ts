import { NavSection } from "@/types/dashboard.types";

export function getNavItemsByRole(role: string): NavSection[] {
  const normalized = (role || "CUSTOMER").toUpperCase();

  if (normalized === "PROVIDER") {
    return [
      {
        title: "Management",
        items: [
          {
            title: "Dashboard",
            href: "/provider/dashboard",
            icon: "layout-dashboard",
          },
          {
            title: "Meals",
            href: "/provider/meals",
            icon: "utensils-crossed",
          },
          {
            title: "Orders",
            href: "/provider/orders",
            icon: "clipboard-list",
          },
        ],
      },
      {
        title: "Account",
        items: [
          {
            title: "Profile",
            href: "/profile",
            icon: "user",
          },
          {
            title: "Settings",
            href: "/settings",
            icon: "settings",
          },
        ],
      },
    ];
  }

  if (normalized === "ADMIN") {
    return [
      {
        title: "Admin",
        items: [
          {
            title: "Dashboard",
            href: "/admin/dashboard",
            icon: "shield-check",
          },
          {
            title: "Users-Management",
            href: "/admin/users-management",
            icon: "users",
          },
          {
            title: "Reports",
            href: "/admin/reports",
            icon: "bar-chart-3",
          },
        ],
      },
    ];
  }

  return [
    {
      title: "Explore",
      items: [
        {
          title: "Home",
          href: "/",
          icon: "house",
        },
        {
          title: "Meals",
          href: "/meals",
          icon: "utensils-crossed",
        },
        {
          title: "Providers",
          href: "/providers",
          icon: "users",
        },
      ],
    },
    {
      title: "Orders",
      items: [
        {
          title: "My Orders",
          href: "/orders",
          icon: "clipboard-list",
        },
        {
          title: "Cart",
          href: "/cart",
          icon: "shopping-cart",
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Profile",
          href: "/profile",
          icon: "user",
        },
      ],
    },
  ];
}