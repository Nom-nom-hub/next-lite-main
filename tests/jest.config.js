module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '**/unit/**/*.test.(js|jsx|ts|tsx)',
    '**/integration/**/*.test.(js|jsx|ts|tsx)',
    '**/e2e/**/*.test.(js|jsx|ts|tsx)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    '../**/*.{js,jsx,ts,tsx}',
    '!../**/*.d.ts',
    '!../**/node_modules/**',
    '!../**/dist/**',
    '!../**/coverage/**',
    '!../**/tests/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
