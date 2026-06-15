/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IAdminDashboardData } from "@/types/dashboard.types";

export async function getDashboardData(): Promise<IAdminDashboardData | null> {
  try {
    const response = await httpClient.get<IAdminDashboardData>("/admin/stats");

    return response?.data ?? null;
  } catch (error: any) {
    console.error(error, "From Dashboard Server Action");
    return null;
  }
}
