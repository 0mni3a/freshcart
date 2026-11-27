const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // بنقرا الرد كنص الأول، لأن بعض الردود (زي الحذف) بتيجي فاضية
  const text = await res.text();

  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const d = data as {
      message?: string;
      errors?: { msg?: string };
    } | null;
    throw new Error(d?.errors?.msg || d?.message || "Something went wrong");
  }

  return data as T;
}