# Testing in Next-Lite

Next-Lite includes built-in support for testing your applications using Jest and React Testing Library.

## Getting Started

Next-Lite's testing setup is pre-configured and ready to use. You can start writing tests immediately without any additional configuration.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Writing Tests

Tests in Next-Lite follow the standard Jest and React Testing Library patterns.

### Component Tests

Here's an example of testing a Button component:

```tsx
// components/__tests__/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByTestId('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('Click me');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const buttonElement = screen.getByTestId('button');
    
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Page Tests

You can also test entire pages:

```tsx
// pages/__tests__/HomePage.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../index';

describe('HomePage', () => {
  test('renders welcome message', () => {
    render(<HomePage />);
    expect(screen.getByText(/welcome to next-lite/i)).toBeInTheDocument();
  });
});
```

## Mocking

Next-Lite's testing setup includes common mocks for:

- CSS Modules
- Static assets (images, etc.)
- Environment variables

### Mocking CSS Modules

CSS Modules are automatically mocked to return the class names as strings:

```tsx
// In your test
import styles from '../Button.module.css';

// styles.button will be 'button'
// styles.primary will be 'primary'
```

### Mocking API Calls

You can mock API calls using Jest's mocking capabilities:

```tsx
// Mocking fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mocked data' }),
  })
);

// Mocking axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: 'mocked data' })),
  post: jest.fn(() => Promise.resolve({ data: 'mocked data' })),
}));
```

## Test Coverage

Next-Lite can generate test coverage reports to help you identify untested code:

```bash
npm run test:coverage
```

This will generate a coverage report in the `coverage` directory.

## Best Practices

- Write tests for all components and pages
- Focus on testing behavior, not implementation details
- Use data-testid attributes for selecting elements
- Test user interactions using fireEvent or userEvent
- Keep tests simple and focused on a single behavior
- Use describe blocks to group related tests
- Use beforeEach for common setup code
