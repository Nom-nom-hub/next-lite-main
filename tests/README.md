# Next-Lite Tests

This directory contains tests for the Next-Lite framework. The tests are organized into three categories:

1. **Unit Tests**: Test individual components and functions in isolation
2. **Integration Tests**: Test how components work together
3. **End-to-End Tests**: Test the entire application flow

## Getting Started

To run the tests, first install the dependencies:

```bash
cd tests
npm install
```

Then run the tests:

```bash
npm test
```

## Test Categories

### Unit Tests

Unit tests focus on testing individual components and functions in isolation. They are located in the `unit` directory.

To run only the unit tests:

```bash
npm run test:unit
```

### Integration Tests

Integration tests focus on testing how components work together. They are located in the `integration` directory.

To run only the integration tests:

```bash
npm run test:integration
```

### End-to-End Tests

End-to-end tests focus on testing the entire application flow. They are located in the `e2e` directory.

To run only the end-to-end tests:

```bash
npm run test:e2e
```

## Test Coverage

To generate a test coverage report:

```bash
npm run test:coverage
```

This will generate a coverage report in the `coverage` directory.

## Continuous Integration

The tests are automatically run in the CI pipeline. The CI configuration is located in the `.github/workflows/ci.yml` file.

## Writing Tests

### Unit Tests

Unit tests should be placed in the `unit` directory. Each test file should be named `*.test.ts` or `*.test.tsx`.

Example:

```tsx
// unit/link.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Link from 'next-lite-framework/link';

describe('Link Component', () => {
  it('renders a link with the correct href', () => {
    render(<Link href="/about">About</Link>);
    
    const link = screen.getByText('About');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });
});
```

### Integration Tests

Integration tests should be placed in the `integration` directory. Each test file should be named `*.test.ts` or `*.test.tsx`.

Example:

```tsx
// integration/routing.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Link from 'next-lite-framework/link';
import { useRouter } from 'next-lite-framework/router';

jest.mock('next-lite-framework/router', () => ({
  useRouter: jest.fn()
}));

describe('Routing Integration', () => {
  // Test implementation
});
```

### End-to-End Tests

End-to-end tests should be placed in the `e2e` directory. Each test file should be named `*.test.ts` or `*.test.tsx`.

Example:

```tsx
// e2e/app.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('End-to-End App Test', () => {
  // Test implementation
});
```

## Mocking

The tests use Jest's mocking capabilities to mock external dependencies. The mocks are located in the `__mocks__` directory.

- `styleMock.js`: Mocks CSS modules
- `fileMock.js`: Mocks file imports

## Configuration

The Jest configuration is located in the `jest.config.js` file. The setup file is located in the `jest.setup.js` file.
