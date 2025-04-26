import React, { createContext, useContext, useState, useEffect } from 'react';

// Router context
interface RouterContextType {
  pathname: string;
  query: Record<string, string>;
  asPath: string;
  push: (url: string, as?: string, options?: any) => Promise<boolean>;
  replace: (url: string, as?: string, options?: any) => Promise<boolean>;
  back: () => void;
  prefetch: (url: string) => Promise<void>;
  events: {
    on: (event: string, callback: (...args: any[]) => void) => void;
    off: (event: string, callback: (...args: any[]) => void) => void;
    emit: (event: string, ...args: any[]) => void;
  };
}

const RouterContext = createContext<RouterContextType | null>(null);

// Router provider
export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState<string>('');
  const [query, setQuery] = useState<Record<string, string>>({});
  const [asPath, setAsPath] = useState<string>('');
  
  // Event listeners
  const eventListeners: Record<string, Array<(...args: any[]) => void>> = {
    routeChangeStart: [],
    routeChangeComplete: [],
    routeChangeError: [],
    beforeHistoryChange: [],
    hashChangeStart: [],
    hashChangeComplete: []
  };
  
  // Initialize router
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { pathname, search, hash } = window.location;
      setPathname(pathname);
      setAsPath(pathname + search + hash);
      
      // Parse query string
      const searchParams = new URLSearchParams(search);
      const queryParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      setQuery(queryParams);
      
      // Handle popstate events
      const handlePopState = () => {
        const { pathname, search, hash } = window.location;
        
        // Emit events
        events.emit('beforeHistoryChange', pathname);
        events.emit('routeChangeStart', pathname + search + hash);
        
        setPathname(pathname);
        setAsPath(pathname + search + hash);
        
        // Parse query string
        const searchParams = new URLSearchParams(search);
        const queryParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });
        setQuery(queryParams);
        
        // Emit completion event
        events.emit('routeChangeComplete', pathname + search + hash);
      };
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, []);
  
  // Navigation methods
  const push = async (url: string, as?: string, options: any = {}): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    
    const targetUrl = as || url;
    
    try {
      // Emit events
      events.emit('routeChangeStart', targetUrl);
      
      // Update history
      if (options.shallow) {
        window.history.replaceState({ url, as }, '', targetUrl);
      } else {
        window.history.pushState({ url, as }, '', targetUrl);
      }
      
      // Update state
      const { pathname, search, hash } = new URL(targetUrl, window.location.origin);
      
      events.emit('beforeHistoryChange', pathname);
      
      setPathname(pathname);
      setAsPath(pathname + search + hash);
      
      // Parse query string
      const searchParams = new URLSearchParams(search);
      const queryParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      setQuery(queryParams);
      
      // Emit completion event
      events.emit('routeChangeComplete', targetUrl);
      
      return true;
    } catch (error) {
      // Emit error event
      events.emit('routeChangeError', error, targetUrl);
      return false;
    }
  };
  
  const replace = async (url: string, as?: string, options: any = {}): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    
    const targetUrl = as || url;
    
    try {
      // Emit events
      events.emit('routeChangeStart', targetUrl);
      
      // Update history
      window.history.replaceState({ url, as }, '', targetUrl);
      
      // Update state
      const { pathname, search, hash } = new URL(targetUrl, window.location.origin);
      
      events.emit('beforeHistoryChange', pathname);
      
      setPathname(pathname);
      setAsPath(pathname + search + hash);
      
      // Parse query string
      const searchParams = new URLSearchParams(search);
      const queryParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      setQuery(queryParams);
      
      // Emit completion event
      events.emit('routeChangeComplete', targetUrl);
      
      return true;
    } catch (error) {
      // Emit error event
      events.emit('routeChangeError', error, targetUrl);
      return false;
    }
  };
  
  const back = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };
  
  const prefetch = async (url: string): Promise<void> => {
    // In a real implementation, this would prefetch the page
    // For now, it's just a placeholder
    console.log(`Prefetching ${url}`);
  };
  
  // Event system
  const events = {
    on: (event: string, callback: (...args: any[]) => void) => {
      if (!eventListeners[event]) {
        eventListeners[event] = [];
      }
      eventListeners[event].push(callback);
    },
    off: (event: string, callback: (...args: any[]) => void) => {
      if (!eventListeners[event]) return;
      eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
    },
    emit: (event: string, ...args: any[]) => {
      if (!eventListeners[event]) return;
      eventListeners[event].forEach(callback => callback(...args));
    }
  };
  
  const router: RouterContextType = {
    pathname,
    query,
    asPath,
    push,
    replace,
    back,
    prefetch,
    events
  };
  
  return (
    <RouterContext.Provider value={router}>
      {children}
    </RouterContext.Provider>
  );
}

// Hook to use router
export function useRouter() {
  const router = useContext(RouterContext);
  
  if (!router) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  
  return router;
}
