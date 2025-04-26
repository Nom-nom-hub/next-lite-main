import React, { ComponentType, lazy, Suspense, useState, useEffect, ReactNode } from 'react';
import { ErrorBoundary } from './error-boundary';

interface DynamicOptions {
  loading?: ComponentType;
  ssr?: boolean;
  suspense?: boolean;
  error?: ComponentType<{ error: Error; reset: () => void }>;
}

type Loader<P> = () => Promise<{ default: ComponentType<P> }>;

/**
 * Dynamic import component for code splitting
 * Similar to Next.js dynamic import
 */
export function dynamic<P extends Record<string, unknown> = any>(
  componentOrLoader: ComponentType<P> | (() => Promise<ComponentType<P>>),
  options: any = {}
): React.ComponentType<P> {
  const {
    loading: LoadingComponent,
    ssr = true,
    suspense = false,
    error: ErrorComponent
  } = options;

  // If SSR is disabled and we're on the server, return a placeholder
  if (!ssr && typeof window === 'undefined') {
    return () => <></>;
  }

  // Create importFunc to handle both component and loader
  const importFunc = () => {
    const result = typeof componentOrLoader === 'function' 
      ? (componentOrLoader as Function)()
      : Promise.resolve({ default: componentOrLoader });
    
    return result.then ? result.then((mod: any) => 
      mod.default ? mod : { default: mod }
    ) : Promise.resolve({ default: result });
  };

  // Create lazy component
  const LazyComponent = lazy(importFunc);

  // Create loadable component
  const LoadableComponent = (props: P) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [Component, setComponent] = useState<ComponentType<P> | null>(null);

    useEffect(() => {
      let isMounted = true;

      importFunc()
        .then((module: { default: ComponentType<P> }) => {
          if (isMounted) {
            setComponent(() => module.default);
            setIsLoading(false);
          }
        })
        .catch((err: Error) => {
          if (isMounted) {
            setError(err);
            setIsLoading(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }, []);

    // Handle error state
    if (error) {
      if (ErrorComponent) {
        return <ErrorComponent error={error} reset={() => setError(null)} />;
      }
      return (
        <div style={{ color: 'red' }}>
          Error loading component: {error.message}
        </div>
      );
    }

    // Handle loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <div>Loading...</div>;
    }

    // Render component
    if (Component) {
      return <Component {...(props as P)} />;
    }

    return null;
  };

  // If suspense is enabled, use React.lazy with Suspense
  if (suspense) {
    const SuspenseComponent = (props: P) => {
      const fallback = LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>;

      return (
        <ErrorBoundary fallback={ErrorComponent ? (error, reset) => <ErrorComponent error={error} reset={reset} /> : undefined}>
          <Suspense fallback={fallback}>
            <LazyComponent {...(props as P)} />
          </Suspense>
        </ErrorBoundary>
      );
    };

    return SuspenseComponent;
  }

  return LoadableComponent;
}

/**
 * Create a loadable component with custom loading and error components
 */
interface LoadableOptions {
  loader: () => Promise<ComponentType<any>>;
  loading?: ComponentType<any>;
  ssr?: boolean;
}

function createDynamicComponent<T>(options: any): React.ComponentType<T> {
  // @ts-ignore - Type compatibility is ensured at runtime
  return dynamic(options.loader, options);
}

export function loadable<P = {}>(options: LoadableOptions): ComponentType<P> {
  return createDynamicComponent<P>(options);
}
