// Add custom jest matchers for testing-library
require('@testing-library/jest-dom');

// Set up global variables for TypeScript
global.React = require('react');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true,
    status: 200,
    headers: new Headers(),
  })
);

// Mock console.error to fail tests on React warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  // Check if this is a React-specific warning
  const message = args.join(' ');
  if (
    /Warning.*not wrapped in act/.test(message) ||
    /Warning.*Cannot update a component/.test(message) ||
    /Warning.*Can't perform a React state update/.test(message)
  ) {
    throw new Error(message);
  }
  originalConsoleError(...args);
};
