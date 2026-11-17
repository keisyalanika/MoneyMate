type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok) {
    throw new Error(body?.message ?? `Permintaan gagal (${response.status}).`);
  }
  return (body?.data ?? (body as T)) as T;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body != null && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`/api/be/${path.replace(/^\//, "")}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  return parseResponse<T>(response);
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`/api/be/${path.replace(/^\//, "")}`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });
  return parseResponse<T>(response);
}
