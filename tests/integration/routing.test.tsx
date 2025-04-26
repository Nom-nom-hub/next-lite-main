import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Link from 'next-lite-framework/link';
import { useRouter } from 'next-lite-framework/router';

// Mock the useRouter hook
jest.mock('next-lite-framework/router', () => ({
  useRouter: jest.fn()
}));

// Mock the Link component to directly call the router.push method
jest.mock('next-lite-framework/link', () => {
  return {
    __esModule: true,
    default: ({ href, children, replace, ...props }) => {
      const router = require('next-lite-framework/router').useRouter();
      const handleClick = (e) => {
        e.preventDefault();
        if (replace) {
          router.replace(href);
        } else {
          router.push(href, href, { shallow: false });
        }
        if (props.onClick) {
          props.onClick(e);
        }
      };
      return <a href={href} onClick={handleClick} {...props}>{children}</a>;
    }
  };
});

describe('Routing Integration', () => {
  const pushMock = jest.fn();
  const replaceMock = jest.fn();

  beforeEach(() => {
    // Clear mocks
    pushMock.mockClear();
    replaceMock.mockClear();

    // Set up the router mock for each test
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/',
      route: '/',
      query: {},
      asPath: '/',
      push: pushMock,
      replace: replaceMock,
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to a new page when a Link is clicked', () => {
    render(
      <nav>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    );

    // Click the About link
    fireEvent.click(screen.getByText('About'));

    // Verify that the router.push method was called with the correct URL
    expect(pushMock).toHaveBeenCalledWith('/about', '/about', expect.anything());
  });

  it('supports programmatic navigation', () => {
    const TestComponent = () => {
      const router = useRouter();

      const handleClick = () => {
        router.push('/dashboard');
      };

      return (
        <button onClick={handleClick}>Go to Dashboard</button>
      );
    };

    render(<TestComponent />);

    // Click the button
    fireEvent.click(screen.getByText('Go to Dashboard'));

    // Verify that the router.push method was called with the correct URL
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('supports navigation with query parameters', () => {
    const TestComponent = () => {
      const router = useRouter();

      const handleClick = () => {
        router.push({
          pathname: '/products',
          query: { category: 'electronics', sort: 'price' }
        });
      };

      return (
        <button onClick={handleClick}>View Electronics</button>
      );
    };

    render(<TestComponent />);

    // Click the button
    fireEvent.click(screen.getByText('View Electronics'));

    // Verify that the router.push method was called with the correct URL
    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/products',
      query: { category: 'electronics', sort: 'price' }
    });
  });
});
