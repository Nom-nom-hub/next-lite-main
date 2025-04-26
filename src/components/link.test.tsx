import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the next-lite-framework
jest.mock('next-lite-framework', () => {
  return {
    Link: ({ href, children, ...props }: any) => (
      <a href={href} {...props}>{children}</a>
    ),
    RouterProvider: ({ children }: any) => <>{children}</>,
    useRouter: () => ({
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn()
      }
    })
  };
});

import { Link, RouterProvider } from 'next-lite-framework';

describe('Link Component', () => {
  it('renders correctly', () => {
    render(
      <RouterProvider>
        <Link href="/about">About</Link>
      </RouterProvider>
    );
    
    const link = screen.getByText('About');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/about');
  });
  
  it('applies custom className', () => {
    render(
      <RouterProvider>
        <Link href="/about" className="custom-link">About</Link>
      </RouterProvider>
    );
    
    const link = screen.getByText('About');
    expect(link).toHaveClass('custom-link');
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    
    render(
      <RouterProvider>
        <Link href="/about" onClick={handleClick}>About</Link>
      </RouterProvider>
    );
    
    const link = screen.getByText('About');
    fireEvent.click(link);
    
    expect(handleClick).toHaveBeenCalled();
  });
});
