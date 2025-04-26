# Next-Lite Basic Example

This is a basic example of a Next-Lite application, showcasing the core features of the framework.

## Features Demonstrated

- **Page Routing**: Basic file-based routing
- **Client-Side Navigation**: Using the `Link` component
- **State Management**: Using React's `useState` hook
- **Components**: Creating and using React components
- **CSS Modules**: Styling with scoped CSS
- **API Routes**: Creating simple backend functionality

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
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## File Structure

```
├── components/       # React components
│   └── Counter.js    # Example component with state
├── pages/            # Pages and routes
│   ├── _app.js       # Custom App component
│   ├── index.js      # Home page
│   ├── about.js      # About page
│   └── api/          # API routes
│       └── hello.js  # Example API endpoint
├── public/           # Static files
├── styles/           # CSS styles
│   ├── globals.css   # Global styles
│   ├── Home.module.css  # CSS modules for pages
│   └── Counter.module.css  # CSS modules for components
└── package.json      # Project dependencies and scripts
```

## Learn More

To learn more about Next-Lite, check out the [Next-Lite documentation](https://github.com/Nom-nom-hub/next-lite-main/wiki).
