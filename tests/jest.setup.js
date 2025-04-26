// Import Jest DOM matchers
import '@testing-library/jest-dom';

// Mock the router
jest.mock('next-lite-framework/router', () => ({
  useRouter: () => ({
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
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
  })
}));

// Mock the head component
jest.mock('next-lite-framework/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => <>{children}</>
  };
});

// Global setup
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});
