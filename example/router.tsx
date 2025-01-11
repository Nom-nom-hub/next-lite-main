import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
});

export function useRouter() {
  return useContext(RouterContext);
}

interface RouterProviderProps {
  routes: Record<string, () => JSX.Element>;
}

export function RouterProvider({ routes }: RouterProviderProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

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
    // Dispatch a custom event for navigation
    window.dispatchEvent(new CustomEvent('pushstate'));
  };

  // Add debugging
  console.log('Current path:', currentPath);
  console.log('Available routes:', Object.keys(routes));

  const Component = routes[currentPath];
  if (!Component) {
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
    <RouterContext.Provider value={{ currentPath, navigate }}>
      <Component />
    </RouterContext.Provider>
  );
}
