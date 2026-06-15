"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { httpClient } from "@/lib/axios/httpClient";
import type { UserInfo } from "@/types/user.types";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;


    if (!sessionToken) {
      return null;
    }

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);
      return null;
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export async function updateUserProfile(data: {
  name?: string;
  image?: File;
}): Promise<{ success: boolean; message: string; data?: UserInfo }> {
  try {
    // Create FormData for file upload support
    const formData = new FormData();
    
    if (data.name) {
      formData.append("name", data.name);
    }
    
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await httpClient.patch<UserInfo>("/auth/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    
    return {
      success: true,
      message: "Profile updated successfully.",
      data: response?.data,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      message: "Failed to update profile.",
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (sessionToken) {
    try {
      await fetch(`${BASE_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `better-auth.session_token=${sessionToken}`,
        },
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  }

  cookieStore.delete("better-auth.session_token");
  cookieStore.delete("role");

  redirect("/login");
}
