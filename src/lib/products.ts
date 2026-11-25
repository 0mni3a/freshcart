import { api } from "@/lip/api";
import { Product, ProductsResponse } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  const first = await api<ProductsResponse>("/products?limit=100&page=1");
  let all = first.data;
  const pages = first.metadata?.numberOfPages ?? 1;

  for (let p = 2; p <= pages; p++) {
    const res = await api<ProductsResponse>(`/products?limit=100&page=${p}`);
    all = all.concat(res.data);
  }
  return all;
}