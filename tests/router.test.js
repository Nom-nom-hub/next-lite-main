/**
 * Tests for the router component
 */
const { React, render, screen, fireEvent, act } = require('./setup');
const { RouterProvider, Link, useRouter } = require('../example/router');

describe('Router', () => {
  // Mock routes
  const routes = {
    '/': () => <div>Home Page</div>,
    '/about': () => <div>About Page</div>,
    '/blog': () => <div>Blog Page</div>,
    '/blog/:id': ({ params }) => <div>Blog Post {params.id}</div>,
  };
  
  beforeEach(() => {
    // Reset history and location
    window.history.pushState({}, '', '/');
  });
  
  test('renders the correct route', () => {
    render(<RouterProvider routes={routes} />);
    
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
  
  test('navigates to a new route', () => {
    const TestComponent = () => {
      const router = useRouter();
      
      return (
        <div>
          <div>Home Page</div>
          <button onClick={() => router.navigate('/about')}>Go to About</button>
        </div>
      );
    };
    
    const testRoutes = {
      '/': () => <TestComponent />,
      '/about': () => <div>About Page</div>,
    };
    
    render(<RouterProvider routes={testRoutes} />);
    
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    
    act(() => {
      fireEvent.click(screen.getByText('Go to About'));
    });
    
    expect(screen.getByText('About Page')).toBeInTheDocument();
  });
  
  test('handles dynamic routes', () => {
    window.history.pushState({}, '', '/blog/123');
    
    render(<RouterProvider routes={routes} />);
    
    expect(screen.getByText('Blog Post 123')).toBeInTheDocument();
  });
  
  test('Link component navigates correctly', () => {
    const TestComponent = () => (
      <div>
        <div>Home Page</div>
        <Link href="/about">About</Link>
      </div>
    );
    
    const testRoutes = {
      '/': () => <TestComponent />,
      '/about': () => <div>About Page</div>,
    };
    
    render(<RouterProvider routes={testRoutes} />);
    
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    
    act(() => {
      fireEvent.click(screen.getByText('About'));
    });
    
    expect(screen.getByText('About Page')).toBeInTheDocument();
  });
  
  test('useRouter hook provides correct values', () => {
    window.history.pushState({}, '', '/blog/123?tab=comments');
    
    const TestComponent = () => {
      const router = useRouter();
      
      return (
        <div>
          <div>Current Path: {router.currentPath}</div>
          <div>Param ID: {router.params.id}</div>
          <div>Query Tab: {router.query.tab}</div>
        </div>
      );
    };
    
    const testRoutes = {
      '/blog/:id': () => <TestComponent />,
    };
    
    render(<RouterProvider routes={testRoutes} />);
    
    expect(screen.getByText('Current Path: /blog/123')).toBeInTheDocument();
    expect(screen.getByText('Param ID: 123')).toBeInTheDocument();
    expect(screen.getByText('Query Tab: comments')).toBeInTheDocument();
  });
  
  test('handles 404 routes', () => {
    window.history.pushState({}, '', '/not-found');
    
    const testRoutes = {
      '/': () => <div>Home Page</div>,
      '404': () => <div>404 Not Found</div>,
    };
    
    render(<RouterProvider routes={testRoutes} />);
    
    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });
});
