import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Link from 'next-lite-framework/link';
import Head from 'next-lite-framework/head';
import { useRouter } from 'next-lite-framework/router';

// Mock the useRouter hook
jest.mock('next-lite-framework/router', () => ({
  useRouter: jest.fn()
}));

// Create a simple test application
const TestApp = () => {
  const [page, setPage] = React.useState('home');
  const router = useRouter();
  
  // Mock the router implementation
  (useRouter as jest.Mock).mockImplementation(() => ({
    pathname: `/${page === 'home' ? '' : page}`,
    route: `/${page === 'home' ? '' : page}`,
    query: {},
    asPath: `/${page === 'home' ? '' : page}`,
    push: (url: string) => {
      // Extract the page name from the URL
      const pageName = url.replace('/', '');
      setPage(pageName || 'home');
    },
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    },
    isFallback: false
  }));
  
  // Render different pages based on the current page state
  const renderPage = () => {
    switch (page) {
      case 'home':
        return (
          <>
            <Head>
              <title>Home Page</title>
            </Head>
            <h1>Welcome to the Home Page</h1>
            <nav>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </>
        );
      case 'about':
        return (
          <>
            <Head>
              <title>About Page</title>
            </Head>
            <h1>About Us</h1>
            <p>This is the about page</p>
            <Link href="/">Back to Home</Link>
          </>
        );
      case 'contact':
        return (
          <>
            <Head>
              <title>Contact Page</title>
            </Head>
            <h1>Contact Us</h1>
            <form>
              <label htmlFor="name">Name:</label>
              <input id="name" type="text" />
              <label htmlFor="email">Email:</label>
              <input id="email" type="email" />
              <button type="submit">Submit</button>
            </form>
            <Link href="/">Back to Home</Link>
          </>
        );
      default:
        return <h1>Page Not Found</h1>;
    }
  };
  
  return (
    <div className="app">
      {renderPage()}
    </div>
  );
};

describe('End-to-End App Test', () => {
  it('renders the home page by default', () => {
    render(<TestApp />);
    
    expect(screen.getByText('Welcome to the Home Page')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
  
  it('navigates to the about page when the About link is clicked', () => {
    render(<TestApp />);
    
    // Click the About link
    fireEvent.click(screen.getByText('About'));
    
    // Verify that the about page is rendered
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('This is the about page')).toBeInTheDocument();
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });
  
  it('navigates to the contact page when the Contact link is clicked', () => {
    render(<TestApp />);
    
    // Click the Contact link
    fireEvent.click(screen.getByText('Contact'));
    
    // Verify that the contact page is rendered
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
  
  it('navigates back to the home page', () => {
    render(<TestApp />);
    
    // Navigate to the about page
    fireEvent.click(screen.getByText('About'));
    
    // Verify that the about page is rendered
    expect(screen.getByText('About Us')).toBeInTheDocument();
    
    // Navigate back to the home page
    fireEvent.click(screen.getByText('Back to Home'));
    
    // Verify that the home page is rendered
    expect(screen.getByText('Welcome to the Home Page')).toBeInTheDocument();
  });
  
  it('allows form interaction on the contact page', () => {
    render(<TestApp />);
    
    // Navigate to the contact page
    fireEvent.click(screen.getByText('Contact'));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name:'), {
      target: { value: 'John Doe' }
    });
    
    fireEvent.change(screen.getByLabelText('Email:'), {
      target: { value: 'john@example.com' }
    });
    
    // Verify that the form values were updated
    expect(screen.getByLabelText('Name:')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Email:')).toHaveValue('john@example.com');
  });
});
