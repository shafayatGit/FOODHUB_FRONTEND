/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import {
  IRegisterCustomerPayload,
  IRegisterProviderPayload,
  registerCustomerSchema,
  registerProviderSchema,
} from "@/zod/auth.validation";
import { IRegisterResponse } from "@/types/auth.types";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { setCookie } from "@/lib/cookieUtils";

export type IRegisterActionSuccess = {
  success: true;
  redirectPath: string;
};

export type IRegisterActionResult = IRegisterActionSuccess | ApiErrorResponse;

const createRegisterAction = async <T extends IRegisterCustomerPayload | IRegisterProviderPayload>(
  payload: T,
  schema: z.ZodType<T>,
  redirectPath?: string,
): Promise<IRegisterActionResult> => {
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid registration payload",
    };
  }

  try {
    const response = await httpClient.post<IRegisterResponse>("/auth/register", parsed.data);
   console.log(response)

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Registration failed",
      };
    }

    const registerResponseData = response;
        
        if (!registerResponseData) {
          return {
            success: false,
            message: "Invalid response structure from server",
          };
        }
    
        const { token, role } = registerResponseData.data;
    
        if (!token || !role) {
          return {
            success: false,
            message: "Missing token or user data from server",
          };
        }
    
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

        const roleFromUser = (role || "CUSTOMER").toString().toUpperCase();
            type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
        
            const roleOfUser = (["CUSTOMER", "PROVIDER", "ADMIN"].includes(roleFromUser)
              ? roleFromUser
              : "CUSTOMER") as UserRole;
        
            await setCookie("role", roleOfUser, 24 * 60 * 60);
        
             function getDefaultDashboardRoute(r: UserRole) {
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
    let targetPath = ""; // default fallback
    targetPath =
      redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(role as UserRole);

    return {
      success: true,
      redirectPath: targetPath,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Registration failed: ${error?.message || "Unknown error"}`,
    };
  }
};

export const registerCustomerAction = async (
  payload: IRegisterCustomerPayload,
  redirectPath?: string,
): Promise<IRegisterActionResult> => createRegisterAction(payload, registerCustomerSchema, redirectPath);

export const registerProviderAction = async (
  payload: IRegisterProviderPayload,
  redirectPath?: string,
): Promise<IRegisterActionResult> => createRegisterAction(payload, registerProviderSchema, redirectPath);
