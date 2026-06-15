"use server";

import { revalidatePath } from "next/cache";
import { httpClient } from "@/lib/axios/httpClient";
import type { AdminUser, AdminUserStatus } from "@/types/admin-user.types";
import type { UserRole } from "@/types/user.types";
import type { PaginationMeta } from "@/types/api.types";

const USER_MANAGEMENT_PATH = "/admin/users-management";
type RawUser = Record<string, unknown>;

function normalizeRole(role: unknown): UserRole {
  const normalized = String(role || "CUSTOMER").toUpperCase();

  if (normalized === "ADMIN" || normalized === "PROVIDER") {
    return normalized;
  }

  return "CUSTOMER";
}

function normalizeStatus(user: RawUser): AdminUserStatus {
  const status = String(user.status || user.userStatus || "").toUpperCase();

  if (
    status === "SUSPENDED" ||
    status === "BLOCKED" ||
    status === "INACTIVE" ||
    user.isSuspended === true ||
    user.isBlocked === true
  ) {
    return "SUSPENDED";
  }

  return "ACTIVE";
}

function normalizeUser(user: RawUser): AdminUser {
  return {
    id: String(user.id || user._id || user.userId),
    name: String(user.name || user.fullName || "Unnamed user"),
    email: String(user.email || "No email"),
    role: normalizeRole(user.role),
    status: normalizeStatus(user),
    createdAt:
      typeof user.createdAt === "string"
        ? user.createdAt
        : typeof user.created_at === "string"
          ? user.created_at
          : undefined,
    phone:
      typeof user.phone === "string"
        ? user.phone
        : typeof user.phoneNumber === "string"
          ? user.phoneNumber
          : null,
  };
}

function normalizeUsersPayload(payload: unknown): AdminUser[] {
  const payloadRecord =
    payload && typeof payload === "object" ? (payload as RawUser) : null;
  const users = Array.isArray(payload)
    ? payload
    : payloadRecord?.users ||
      payloadRecord?.result ||
      payloadRecord?.items ||
      [];

  if (!Array.isArray(users)) {
    return [];
  }

  return users
    .filter((user): user is RawUser =>
      Boolean(user && typeof user === "object"),
    )
    .map(normalizeUser)
    .filter((user) => user.id !== "undefined");
}

export async function getAdminUsers(params?: {
  page?: string | number;
  limit?: string | number;
  searchTerm?: string;
}): Promise<{ users: AdminUser[]; meta?: PaginationMeta }> {
  try {
    const response = await httpClient.get<unknown>("/admin/users", { params });

    return {
      users: normalizeUsersPayload(response?.data),
      meta: (response as any)?.meta,
    };
  } catch (error) {
    console.error(error, "From Admin Users Server Action");
    return { users: [] };
  }
}

export async function updateAdminUserStatus(formData: FormData) {
  const userId = String(formData.get("userId") || "");
  const status = String(formData.get("status") || "").toUpperCase();

  if (!userId || (status !== "ACTIVE" && status !== "SUSPENDED")) {
    return;
  }

  try {
    await httpClient.patch(`/admin/users/${userId}`, { status });
    revalidatePath(USER_MANAGEMENT_PATH);
  } catch (error) {
    console.error(error, "From Update Admin User Status Server Action");
  }
}

export async function deleteAdminUser(formData: FormData) {
  const userId = String(formData.get("userId") || "");

  if (!userId) {
    return;
  }

  try {
    await httpClient.delete(`/admin/users/${userId}`);
    revalidatePath(USER_MANAGEMENT_PATH);
  } catch (error) {
    console.error(error, "From Delete Admin User Server Action");
  }
}
