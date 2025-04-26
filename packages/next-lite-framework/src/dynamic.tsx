import React, { ComponentType, lazy, Suspense, useState, useEffect } from 'react';
import { ErrorBoundary } from './error-boundary';

interface DynamicOptions {
  loading?: ComponentType;
  ssr?: boolean;
  suspense?: boolean;
  error?: ComponentType<{ error: Error; reset: () => void }>;
}

interface LoadableOptions extends DynamicOptions {
  loader: () => Promise<{ default: ComponentType<any> }>;
}

/**
 * Dynamic import component for code splitting
 * Similar to Next.js dynamic import
 */
export function dynamic<P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: DynamicOptions = {}
): ComponentType<P> {
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
        .then(module => {
          if (isMounted) {
            setComponent(() => module.default);
            setIsLoading(false);
          }
        })
        .catch(err => {
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
      return <Component {...props} />;
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
            <LazyComponent {...props} />
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
export function loadable<P = {}>(options: LoadableOptions): ComponentType<P> {
  return dynamic<P>(options.loader, options);
}
