const API_BASE = "/api";

export const customFetch = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const fullUrl = `${API_BASE}${url}`;
  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw Object.assign(new Error(data.error ?? response.statusText), {
      status: response.status,
      statusText: response.statusText,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};
