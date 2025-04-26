module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^next-lite-framework/(.*)$': '<rootDir>/src/$1',
    '^next-lite-framework$': '<rootDir>/src/index.js'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/packages/',
    '/my-app/',
    '/examples/'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }],
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx,js,jsx}',
    '!src/**/__tests__/**/*'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  // Prevent module name collisions
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/packages/',
    '<rootDir>/my-app/',
    '<rootDir>/examples/'
  ],
  // Only run tests in the tests directory
  testMatch: [
    '<rootDir>/tests/**/*.test.{ts,tsx,js,jsx}'
  ]
};
