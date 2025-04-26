const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Mock components
const Link = ({ href, children, onClick, className }) => (
  React.createElement('a', { href, onClick, className }, children)
);

const RouterProvider = ({ children }) => children;

describe('Link Component', () => {
  it('renders correctly', () => {
    render(
      React.createElement(RouterProvider, null,
        React.createElement(Link, { href: '/about' }, 'About')
      )
    );
    
    const link = screen.getByText('About');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/about');
  });
  
  it('applies custom className', () => {
    render(
      React.createElement(RouterProvider, null,
        React.createElement(Link, { href: '/about', className: 'custom-link' }, 'About')
      )
    );
    
    const link = screen.getByText('About');
    expect(link).toHaveClass('custom-link');
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    
    render(
      React.createElement(RouterProvider, null,
        React.createElement(Link, { href: '/about', onClick: handleClick }, 'About')
      )
    );
    
    const link = screen.getByText('About');
    fireEvent.click(link);
    
    expect(handleClick).toHaveBeenCalled();
  });
});
