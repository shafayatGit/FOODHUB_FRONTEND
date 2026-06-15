import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
/*
{
    "success": true,
    "message": "Dashboard statistics fetched successfully",
    "data": {
        "users": {
            "total": 19,
            "customers": 7,
            "providers": 8,
            "admins": 4,
            "deleted": 0
        },
        "orders": {
            "total": 1,
            "totalRevenue": 12,
            "totalDeliveryFees": 2,
            "averageOrderValue": 12
        },
        "meals": {
            "total": 1,
            "available": 1,
            "unavailable": 0,
            "averagePrice": 12.5
        },
        "providers": {
            "total": 8
        },
        "reviews": {
            "total": 0,
            "averageRating": 0
        },
        "categories": {
            "total": 2
        },
        "topMeals": [
            {
                "id": "e40bcd35-967b-4b02-a4af-f0609045ccdf",
                "title": "Classic Margherita",
                "price": 12.5,
                "reviewCount": 0
            }
        ],
        "topProviders": [
            {
                "id": "1ca23c9b-1033-401c-9a96-3903b87bf3f1",
                "restaurantName": "FoodMaker Bistro",
                "orderCount": 1
            },
            {
                "id": "e6b7aeaa-3aff-4da1-9901-92bb92c358b9",
                "restaurantName": "FoodMaker Bistro",
                "orderCount": 0
            },
            {
                "id": "1b270dd6-ecac-44ca-a9e8-c498ce1b7916",
                "restaurantName": "restaurant",
                "orderCount": 0
            },
            {
                "id": "0871b544-44cc-421b-b1f4-cef363017f2d",
                "restaurantName": "restaurant",
                "orderCount": 0
            },
            {
                "id": "70de0202-8154-44dd-83da-cefe946fc767",
                "restaurantName": "restaurant",
                "orderCount": 0
            }
        ]
    }
}

*/
export interface IAdminDashboardData {
    users: {
      total: number;
      customers: number;
      providers: number;
      admins: number;
      deleted: number;
    };
    orders: {
      total: number;
      totalRevenue: number;
      totalDeliveryFees: number;
      averageOrderValue: number;
    };
    meals: {
      total: number;
      available: number;
      unavailable: number;
      averagePrice: number;
    };
    providers: {
      total: number;
    };
    reviews: {
      total: number;
      averageRating: number;
    };
    categories: {
      total: number;
    };
    topMeals: {
      id: string;
      title: string;
      price: number;
      reviewCount: number;
    }[];
    topProviders: {
      id: string;
      restaurantName: string;
      orderCount: number;
    }[];
}