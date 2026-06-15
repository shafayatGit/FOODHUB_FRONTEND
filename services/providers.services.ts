"use server";

import { httpClient } from "@/lib/axios/httpClient";
import type { Provider } from "@/types/provider.types";

export async function getProviders(): Promise<Provider[]> {
  try {
    const response = await httpClient.get<Provider[]>("/providers");
    return response?.data ?? [];
  } catch (error) {
    console.error(error, "From All Providers Server Action");
    return [];
  }
}

export async function getProviderById(id: string): Promise<Provider | null> {
try{
    const response = await httpClient.get<Provider>(`/providers/${id}`);

    return response?.data ?? null;
  } catch (error) {
    console.error(error, "From Single Provider Server Action");
    return null;
  }
}
