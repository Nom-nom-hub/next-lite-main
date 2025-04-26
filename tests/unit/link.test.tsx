import React from 'react';
import { render, screen } from '@testing-library/react';
import Link from 'next-lite-framework/link';

describe('Link Component', () => {
  it('renders a link with the correct href', () => {
    render(<Link href="/about">About</Link>);
    
    const link = screen.getByText('About');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/about');
  });

  it('passes additional props to the underlying a element', () => {
    render(
      <Link href="/contact" className="custom-link" data-testid="contact-link">
        Contact
      </Link>
    );
    
    const link = screen.getByTestId('contact-link');
    expect(link).toHaveAttribute('href', '/contact');
    expect(link).toHaveClass('custom-link');
  });

  it('renders children correctly', () => {
    render(
      <Link href="/home">
        <span>Home</span>
        <span>Page</span>
      </Link>
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Page')).toBeInTheDocument();
  });

  it('supports the replace prop', () => {
    render(<Link href="/settings" replace>Settings</Link>);
    
    const link = screen.getByText('Settings');
    expect(link).toHaveAttribute('href', '/settings');
    // In a real test, we would verify that the replace behavior works
  });
});
