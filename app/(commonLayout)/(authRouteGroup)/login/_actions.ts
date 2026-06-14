/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";


import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { setCookie } from "@/lib/cookieUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export type ILoginActionSuccess = {
  success: true;
  redirectPath: string;
  data?: ILoginResponse;
};

export type ILoginActionResult = ILoginActionSuccess | ApiErrorResponse;

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<ILoginActionResult> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  let targetPath = "";

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Login failed",
      };
    }

    const {  token, user } = response.data.data;


    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
    // persist role in cookie so server-side proxy/middleware can read it
    const roleFromUser = (user?.role || "CUSTOMER").toString().toUpperCase();
    type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

    const role = (["CUSTOMER", "PROVIDER", "ADMIN"].includes(roleFromUser)
      ? roleFromUser
      : "CUSTOMER") as UserRole;

    await setCookie("role", role, 24 * 60 * 60);

    function getDefaultDashboardRoute(r: UserRole) {
      switch (r) {
        case "ADMIN":
          return "/admin";
        case "PROVIDER":
          return "/provider/dashboard";
        case "CUSTOMER":
        default:
          return "/orders";
      }
    }

    function isValidRedirectForRole(path: string, r: UserRole) {
      const normalized = path.replace(/\/+$/, "") || "/";

      // admin can go anywhere under /admin
      if (r === "ADMIN") return /^\/admin(\/.*)?$/.test(normalized) || normalized === "/admin";

      if (r === "PROVIDER") return /^\/provider(\/.*)?$/.test(normalized) || normalized.startsWith("/provider");

      // customer allowed paths
      if (r === "CUSTOMER") {
        return (
          normalized === "/" ||
          normalized === "/home" ||
          /^\/meals(\/.*)?$/.test(normalized) ||
          /^\/providers(\/.*)?$/.test(normalized) ||
          normalized === "/cart" ||
          normalized === "/checkout" ||
          /^\/orders(\/.*)?$/.test(normalized) ||
          normalized === "/profile"
        );
      }

      return false;
    }

    targetPath =
      redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(role as UserRole);
    
  } catch (error: any) {
    console.log(error, "error");
    return {
      success: false,
      message: `Login failed: ${error?.message || "Unknown error"}`,
    };

   

    }

    return {
      success: true,
      redirectPath: targetPath,
 
    };
};
