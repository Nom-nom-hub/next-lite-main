import React, { createContext, useContext, useState, useEffect } from 'react';

// Check if we're running on the server or client
const isServer = typeof window === 'undefined';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  isSSR: boolean;
  initialProps?: Record<string, any>;
  params?: Record<string, string>;
  query?: Record<string, string>;
  routeGroup?: string;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
  isSSR: isServer,
  initialProps: {},
  params: {},
  query: {},
  routeGroup: undefined,
});

export function useRouter() {
  return useContext(RouterContext);
}

interface RouterProviderProps {
  routes: Record<string, () => JSX.Element>;
  initialPath?: string;
  initialProps?: Record<string, any>;
  routeGroups?: Record<string, any>;
  routeMiddleware?: Record<string, (context: any, next: () => void) => void>;
}

export function RouterProvider({
  routes,
  initialPath,
  initialProps = {},
  routeGroups = {},
  routeMiddleware = {}
}: RouterProviderProps) {
  // Use initialPath for SSR or window.location.pathname for client
  const [currentPath, setCurrentPath] = useState(
    initialPath || (!isServer ? window.location.pathname : '/')
  );

  // Extract query parameters
  const [query, setQuery] = useState<Record<string, string>>({});

  // Route parameters (for dynamic routes)
  const [params, setParams] = useState<Record<string, string>>({});

  // Current route group
  const [routeGroup, setRouteGroup] = useState<string | undefined>(undefined);

  // Parse URL to extract query parameters
  const parseUrl = (url: string) => {
    const parsedUrl = new URL(url, 'http://localhost');
    const queryParams: Record<string, string> = {};

    parsedUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    return {
      path: parsedUrl.pathname,
      query: queryParams
    };
  };

  // Match route pattern to extract parameters
  const matchRoute = (path: string) => {
    // First check for exact match
    if (routes[path]) {
      return { match: path, params: {} };
    }

    // Check for dynamic routes with parameters
    const routePaths = Object.keys(routes);

    for (const routePath of routePaths) {
      // Skip exact matches (already checked)
      if (!routePath.includes('[') && !routePath.includes(':')) continue;

      // Convert route pattern to regex
      const pattern = routePath
        .replace(/\[([^\]]+)\]/g, '([^/]+)') // [param] -> ([^/]+)
        .replace(/:([^/]+)/g, '([^/]+)'); // :param -> ([^/]+)

      // Extract parameter names
      const paramNames: string[] = [];
      const paramMatches = routePath.matchAll(/\[([^\]]+)\]|:([^/]+)/g);

      for (const match of paramMatches) {
        paramNames.push(match[1] || match[2]);
      }

      // Create regex to match the path
      const regex = new RegExp(`^${pattern}$`);
      const match = path.match(regex);

      if (match) {
        // Extract parameter values
        const params: Record<string, string> = {};
        for (let i = 0; i < paramNames.length; i++) {
          params[paramNames[i]] = match[i + 1];
        }

        return { match: routePath, params };
      }
    }

    return { match: null, params: {} };
  };

  // Find the route group for a path
  const findRouteGroup = (path: string) => {
    const groupPaths = Object.keys(routeGroups);

    // Sort by length (longest first) to match the most specific group
    groupPaths.sort((a, b) => b.length - a.length);

    for (const groupPath of groupPaths) {
      if (path.startsWith(groupPath)) {
        return groupPath;
      }
    }

    return undefined;
  };

  // Apply middleware to a route
  const applyMiddleware = (path: string, context: any) => {
    // Find middleware that applies to this path
    const middlewarePaths = Object.keys(routeMiddleware);

    // Sort by length (longest first) to match the most specific middleware
    middlewarePaths.sort((a, b) => b.length - a.length);

    const applicableMiddleware = [];

    for (const middlewarePath of middlewarePaths) {
      if (path === middlewarePath || path.startsWith(`${middlewarePath}/`)) {
        applicableMiddleware.push(routeMiddleware[middlewarePath]);
      }
    }

    // If no middleware applies, return true to continue
    if (applicableMiddleware.length === 0) {
      return true;
    }

    // Apply middleware in order
    let index = 0;
    let shouldContinue = true;

    const next = () => {
      if (index < applicableMiddleware.length) {
        const middleware = applicableMiddleware[index++];
        middleware(context, next);
      } else {
        shouldContinue = true;
      }
    };

    // Start the middleware chain
    applicableMiddleware[index++](context, next);

    return shouldContinue;
  };

  useEffect(() => {
    // Skip on server
    if (isServer) return;

    // Parse the current URL
    const { path, query: urlQuery } = parseUrl(window.location.href);
    setQuery(urlQuery);

    // Match the route and extract parameters
    const { match, params: routeParams } = matchRoute(path);
    if (match) {
      setParams(routeParams);
    }

    // Find the route group
    const group = findRouteGroup(path);
    setRouteGroup(group);

    const handlePopState = () => {
      const { path, query: urlQuery } = parseUrl(window.location.href);
      setCurrentPath(path);
      setQuery(urlQuery);

      // Match the route and extract parameters
      const { match, params: routeParams } = matchRoute(path);
      if (match) {
        setParams(routeParams);
      }

      // Find the route group
      const group = findRouteGroup(path);
      setRouteGroup(group);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);

    // Hydrate from SSR if available
    if (!isServer && window.__INITIAL_PROPS__) {
      initialProps = window.__INITIAL_PROPS__;
    }
  }, []);

  const navigate = (path: string, options: { replace?: boolean } = {}) => {
    if (!isServer) {
      // Parse the URL to extract query parameters
      const { path: urlPath, query: urlQuery } = parseUrl(path);

      // Update the path and query
      setCurrentPath(urlPath);
      setQuery(urlQuery);

      // Match the route and extract parameters
      const { match, params: routeParams } = matchRoute(urlPath);
      if (match) {
        setParams(routeParams);
      }

      // Find the route group
      const group = findRouteGroup(urlPath);
      setRouteGroup(group);

      // Update the browser history
      if (options.replace) {
        window.history.replaceState({}, '', path);
      } else {
        window.history.pushState({}, '', path);
      }

      // Dispatch a custom event for navigation
      window.dispatchEvent(new CustomEvent('pushstate'));
    } else {
      // Just update the path on server
      setCurrentPath(path);
    }
  };

  // Add debugging
  console.log('Current path:', currentPath);
  console.log('Available routes:', Object.keys(routes));
  console.log('Route params:', params);
  console.log('Query params:', query);
  console.log('Route group:', routeGroup);

  // Match the route
  const { match, params: matchParams } = matchRoute(currentPath);
  let Component = match ? routes[match] : null;

  // Apply middleware if available
  const middlewareContext = {
    path: currentPath,
    params: { ...params, ...matchParams },
    query,
    routeGroup,
  };

  // Check if middleware allows this route to be rendered
  const shouldRender = !Component || Object.keys(routeMiddleware).length === 0 ||
    applyMiddleware(currentPath, middlewareContext);

  if (!Component || !shouldRender) {
    console.warn(`No route found for path: ${currentPath}`);
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <p>Current path: {currentPath}</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <RouterContext.Provider value={{
      currentPath,
      navigate,
      isSSR: isServer,
      initialProps,
      params: { ...params, ...matchParams },
      query,
      routeGroup
    }}>
      <Component />
    </RouterContext.Provider>
  );
}
