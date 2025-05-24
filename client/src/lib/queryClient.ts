import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Get API URL from environment variables or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper to ensure URL has correct base
function getFullUrl(url: string): string {
  // If the URL already starts with http or https, it's already absolute
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's already a full API path starting with /api, just ensure it has the right base
  if (url.startsWith('/api/')) {
    return `${API_BASE_URL}${url.substring(4)}`;
  }
  
  // Otherwise, assume it's a relative API path
  return `${API_BASE_URL}/${url.startsWith('/') ? url.substring(1) : url}`;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const fullUrl = getFullUrl(url);
  
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = getFullUrl(queryKey[0] as string);
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
