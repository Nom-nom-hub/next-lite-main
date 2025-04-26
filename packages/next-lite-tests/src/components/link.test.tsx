import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Link } from 'next-lite-framework';
import { RouterProvider } from 'next-lite-framework';

// Mock router
jest.mock('next-lite-framework', () => {
  const originalModule = jest.requireActual('next-lite-framework');
  
  return {
    ...originalModule,
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
  
  it('does not prevent default for external links', () => {
    const handleClick = jest.fn();
    
    render(
      <RouterProvider>
        <Link href="https://example.com" onClick={handleClick}>External</Link>
      </RouterProvider>
    );
    
    const link = screen.getByText('External');
    const event = createEvent.click(link);
    fireEvent(link, event);
    
    expect(handleClick).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });
  
  it('prevents default for internal links', () => {
    const handleClick = jest.fn();
    
    render(
      <RouterProvider>
        <Link href="/about" onClick={handleClick}>About</Link>
      </RouterProvider>
    );
    
    const link = screen.getByText('About');
    const event = createEvent.click(link);
    fireEvent(link, event);
    
    expect(handleClick).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });
  
  it('does not prevent default when ctrl/meta key is pressed', () => {
    const handleClick = jest.fn();
    
    render(
      <RouterProvider>
        <Link href="/about" onClick={handleClick}>About</Link>
      </RouterProvider>
    );
    
    const link = screen.getByText('About');
    
    // Test with ctrl key
    const ctrlEvent = createEvent.click(link, { ctrlKey: true });
    fireEvent(link, ctrlEvent);
    expect(ctrlEvent.defaultPrevented).toBe(false);
    
    // Test with meta key
    const metaEvent = createEvent.click(link, { metaKey: true });
    fireEvent(link, metaEvent);
    expect(metaEvent.defaultPrevented).toBe(false);
  });
});

// Helper to create custom events
const createEvent = {
  click: (element: Element, options = {}) => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ...options
    });
    
    element.dispatchEvent(event);
    return event;
  }
};
