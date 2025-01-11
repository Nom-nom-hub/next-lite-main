import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
  params: {},
});

export function useRouter() {
  return useContext(RouterContext);
}

interface RouterProviderProps {
  routes: Record<string, () => JSX.Element>;
}

function matchRoute(pattern: string, path: string): { match: boolean; params: Record<string, string> } {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  const params: Record<string, string> = {};

  if (patternParts.length !== pathParts.length) {
    return { match: false, params };
  }

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      // This is a dynamic segment
      const paramName = patternPart.slice(1);
      params[paramName] = decodeURIComponent(pathPart);
      continue;
    }

    if (patternPart !== pathPart) {
      return { match: false, params };
    }
  }

  return { match: true, params };
}

export function RouterProvider({ routes }: RouterProviderProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.dispatchEvent(new CustomEvent('pushstate'));
  };

  // Find matching route
  for (const [pattern, Component] of Object.entries(routes)) {
    const { match, params: routeParams } = matchRoute(pattern, currentPath);
    if (match) {
      return (
        <RouterContext.Provider value={{ currentPath, navigate, params: routeParams }}>
          <Component />
        </RouterContext.Provider>
      );
    }
  }

  // No match found
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <p>Current path: {currentPath}</p>
    </div>
  );
}
