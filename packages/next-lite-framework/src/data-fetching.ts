import { useEffect, useState } from 'react';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  cache?: 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached';
  credentials?: 'include' | 'same-origin' | 'omit';
  redirect?: 'follow' | 'error' | 'manual';
  referrerPolicy?: string;
  mode?: 'cors' | 'no-cors' | 'same-origin';
}

interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  mutate: (data?: T) => void;
}

// SWR-like data fetching hook
export function useFetch<T = any>(url: string, options?: FetchOptions): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        method: options?.method || 'GET',
        headers: options?.headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
        cache: options?.cache,
        credentials: options?.credentials,
        redirect: options?.redirect,
        referrerPolicy: options?.referrerPolicy,
        mode: options?.mode
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  // Mutate data
  const mutate = (newData?: T) => {
    if (newData) {
      setData(newData);
    } else {
      fetchData();
    }
  };
  
  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [url]);
  
  return { data, error, loading, mutate };
}

// Cache for SWR
const cache = new Map<string, any>();

// SWR implementation
export function useSWR<T = any>(key: string, fetcher: (key: string) => Promise<T>): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(() => cache.get(key) || null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(!cache.has(key));
  
  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetcher(key);
      setData(result);
      cache.set(key, result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  // Mutate data
  const mutate = (newData?: T) => {
    if (newData) {
      setData(newData);
      cache.set(key, newData);
    } else {
      fetchData();
    }
  };
  
  // Fetch data on mount
  useEffect(() => {
    if (!cache.has(key)) {
      fetchData();
    }
  }, [key]);
  
  return { data, error, loading, mutate };
}
