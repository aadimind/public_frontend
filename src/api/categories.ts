import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/types";
import { apiGet, API_CONFIG, ApiClientError, validateResponse } from "./client";
import { isCategory, isCategoryArray } from "./validators";
import { mockCategories } from "@/data/mockCategories";
import { delay } from "@/lib/utils";

async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  if (API_CONFIG.useMock) {
    await delay(150);
    return mockCategories;
  }
  const data = await apiGet<unknown>("/api/public/categories", { signal });
  return validateResponse(data, isCategoryArray, "INVALID_CATEGORIES_RESPONSE");
}

async function fetchCategoryBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<Category> {
  if (API_CONFIG.useMock) {
    await delay(180);
    const category = mockCategories.find((c) => c.slug === slug);
    if (!category) {
      throw new ApiClientError(404, "Category not found", "NOT_FOUND");
    }
    return category;
  }
  const data = await apiGet<unknown>(
    `/api/public/categories/${encodeURIComponent(slug)}`,
    { signal }
  );
  return validateResponse(data, isCategory, "INVALID_CATEGORY_RESPONSE");
}

export const categoriesQueryKeys = {
  all: ["categories"] as const,
  list: () => ["categories", "list"] as const,
  detail: (slug: string) => ["categories", "detail", slug] as const,
};

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoriesQueryKeys.list(),
    queryFn: ({ signal }) => fetchCategories(signal),
    staleTime: 1000 * 60 * 30,
  });
}

export function useCategoryQuery(slug: string | undefined) {
  return useQuery({
    queryKey: slug ? categoriesQueryKeys.detail(slug) : ["categories", "detail", "none"],
    queryFn: ({ signal }) => {
      if (!slug) throw new Error("Slug is required");
      return fetchCategoryBySlug(slug, signal);
    },
    enabled: !!slug,
  });
}