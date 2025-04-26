# Next-Lite Blog Example

This is a simple blog example built with Next-Lite Framework.

## Features

- Server-side rendering with `getStaticProps` and `getStaticPaths`
- Dynamic routes for blog posts
- API routes for fetching data
- Styling with CSS Modules
- TypeScript support

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `pages/index.tsx`: Home page that displays a list of blog posts
- `pages/posts/[id].tsx`: Dynamic page for individual blog posts
- `pages/api/posts.ts`: API route for fetching all posts
- `pages/api/posts/[id].ts`: API route for fetching a single post
- `styles/`: CSS Modules for styling the application

## API

This example uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) as a fake API for demonstration purposes.

## Learn More

To learn more about Next-Lite, check out the [Next-Lite documentation](https://github.com/next-lite/next-lite).
