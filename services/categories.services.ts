"use server";

import { revalidatePath } from "next/cache";
import { httpClient } from "@/lib/axios/httpClient";
import type { Category } from "@/types/category.types";

const CATEGORY_MANAGEMENT_PATH = "/admin/catagory-management";
type RawRecord = Record<string, unknown>;

export interface CategoryActionState {
  success: boolean;
  message: string;
}

function normalizeCategory(category: RawRecord): Category {
  return {
    id: String(category.id || category._id),
    name: String(category.name || "Untitled category"),
    description: String(category.description || "No description provided."),
  };
}

function normalizeCategoriesPayload(payload: unknown): Category[] {
  const payloadRecord =
    payload && typeof payload === "object" ? (payload as RawRecord) : null;
  const categories = Array.isArray(payload)
    ? payload
    : payloadRecord?.categories ||
      payloadRecord?.items ||
      payloadRecord?.result ||
      [];

  if (!Array.isArray(categories)) {
    return [];
  }

  return categories
    .filter((item): item is RawRecord => Boolean(item && typeof item === "object"))
    .map(normalizeCategory)
    .filter((category) => category.id !== "undefined");
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await httpClient.get<unknown>("/categories");

    return normalizeCategoriesPayload(response?.data);
  } catch (error) {
    console.error(error, "From Categories Server Action");
    return [];
  }
}

export async function createCategory(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name || !description) {
    return {
      success: false,
      message: "Category name and description are required.",
    };
  }

  try {
    await httpClient.post("/categories", {
      name,
      description,
    });
    revalidatePath(CATEGORY_MANAGEMENT_PATH);
    return {
      success: true,
      message: "Category created successfully.",
    };
  } catch (error) {
    console.error(error, "From Create Category Server Action");
    return {
      success: false,
      message: "Unable to create category.",
    };
  }
}
