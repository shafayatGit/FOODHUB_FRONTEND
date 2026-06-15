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
  IRegisterCustomerFormData,
  IRegisterProviderFormData,
} from "@/zod/auth.validation";
import { IRegisterResponse } from "@/types/auth.types";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { setCookie } from "@/lib/cookieUtils";
import { handleAxiosError } from "@/lib/utils";

export type IRegisterActionSuccess = {
  success: true;
  redirectPath: string;
};

export type IRegisterActionResult = IRegisterActionSuccess | ApiErrorResponse;

const createRegisterAction = async <
  T extends IRegisterCustomerPayload | IRegisterProviderPayload,
  F extends IRegisterCustomerFormData | IRegisterProviderFormData
>(
  formData: F,
  schema: z.ZodType<T>,
  redirectPath?: string,
): Promise<IRegisterActionResult> => {
  // Validate the basic fields (excluding file)
  const baseData = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    role: formData.role,
    ...(formData.role === "PROVIDER" && {
      restaurantName: (formData as IRegisterProviderFormData).restaurantName,
      description: (formData as IRegisterProviderFormData).description,
      address: (formData as IRegisterProviderFormData).address,
      isOpen: (formData as IRegisterProviderFormData).isOpen,
      openTime: (formData as IRegisterProviderFormData).openTime,
      closeTime: (formData as IRegisterProviderFormData).closeTime,
    }),
  };

  const parsed = schema.safeParse(baseData);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid registration payload",
    };
  }

  try {
    // Create FormData for file upload
    const form = new FormData();
    
    // Add all text fields
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("role", formData.role);

    if (formData.role === "PROVIDER") {
      const providerData = formData as IRegisterProviderFormData;
      form.append("restaurantName", providerData.restaurantName);
      if (providerData.description) form.append("description", providerData.description);
      form.append("address", providerData.address);
      if (providerData.isOpen !== undefined) form.append("isOpen", String(providerData.isOpen));
      if (providerData.openTime) form.append("openTime", providerData.openTime);
      if (providerData.closeTime) form.append("closeTime", providerData.closeTime);
    }

    // Add image file if provided
    if (formData.image) {
      form.append("image", formData.image);
    }

    // Send FormData to backend (multipart/form-data)
    const response = await httpClient.post<IRegisterResponse>(
      "/auth/register",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

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
      message: handleAxiosError(error),
    };
  }
};

export const registerCustomerAction = async (
  formData: IRegisterCustomerFormData,
  redirectPath?: string,
): Promise<IRegisterActionResult> =>
  createRegisterAction(formData, registerCustomerSchema, redirectPath);

export const registerProviderAction = async (
  formData: IRegisterProviderFormData,
  redirectPath?: string,
): Promise<IRegisterActionResult> =>
  createRegisterAction(formData, registerProviderSchema, redirectPath);
