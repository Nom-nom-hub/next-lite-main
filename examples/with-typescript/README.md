# Next-Lite TypeScript Example

This is a TypeScript example of a Next-Lite application, showcasing how to use TypeScript with the Next-Lite framework.

## Features Demonstrated

- **TypeScript Integration**: Full TypeScript support throughout the application
- **Type-Safe Components**: React components with proper TypeScript interfaces
- **Type-Safe API Routes**: API endpoints with TypeScript types
- **Type-Safe Data Fetching**: Fetching and displaying data with proper typing
- **Custom Types and Interfaces**: Defining and using custom TypeScript types

## Getting Started

```bash
# Install dependencies
npm install
# or
yarn
# or with flash-install (recommended)
flash-direct install

# Run the development server
npm run dev
# or
yarn dev

# Type checking
npm run type-check
# or
yarn type-check
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## File Structure

```
├── components/       # TypeScript React components
│   └── Counter.tsx   # Example component with TypeScript props
├── pages/            # Pages and routes
│   ├── _app.tsx      # Custom App component with TypeScript
│   ├── index.tsx     # Home page
│   ├── users.tsx     # Users page with type-safe data fetching
│   └── api/          # API routes
│       └── users.ts  # Type-safe API endpoint
├── public/           # Static files
├── styles/           # CSS styles
├── types/            # TypeScript type definitions
│   └── user.ts       # User-related type definitions
├── next-env.d.ts     # TypeScript declarations for Next-Lite
├── tsconfig.json     # TypeScript configuration
└── package.json      # Project dependencies and scripts
```

## TypeScript Configuration

This example includes a properly configured `tsconfig.json` file that sets up TypeScript for use with Next-Lite. Key settings include:

- Strict type checking
- JSX preservation
- Module resolution
- Path aliases
- Type declaration files

## Learn More

To learn more about using TypeScript with Next-Lite, check out the [Next-Lite documentation](https://github.com/Nom-nom-hub/next-lite-main/wiki).
