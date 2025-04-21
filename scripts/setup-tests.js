/**
 * Jest setup file for Next-Lite
 * This file is run before each test file
 */

// Mock CSS modules
jest.mock('*.module.css', () => {
  return new Proxy(
    {},
    {
      get: function getter(target, key) {
        if (key === '__esModule') {
          return false;
        }
        return key;
      },
    },
  );
});

// Mock regular CSS imports
jest.mock('*.css', () => {
  return {};
});

// Mock environment variables
process.env.NEXT_LITE_TEST = 'true';

// Add custom matchers if needed
expect.extend({
  // Add custom matchers here
});
