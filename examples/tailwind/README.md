# Next-Lite with Tailwind CSS

This example shows how to integrate [Tailwind CSS](https://tailwindcss.com) with Next-Lite.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

This example uses a custom plugin in the `next-lite.config.js` file to process Tailwind CSS during the build process. The plugin uses PostCSS with the Tailwind CSS and Autoprefixer plugins to process the CSS file.

### Configuration Files

- `next-lite.config.js`: Next-Lite configuration with Tailwind CSS plugin
- `tailwind.config.js`: Tailwind CSS configuration
- `styles/globals.css`: Global CSS file with Tailwind CSS imports

### Dependencies

- `tailwindcss`: Tailwind CSS framework
- `postcss`: CSS processor
- `autoprefixer`: PostCSS plugin to add vendor prefixes

## Learn More

To learn more about Tailwind CSS, take a look at the following resources:

- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS features and API.
- [Next-Lite Documentation](https://github.com/teckcode/next-lite/tree/main/docs) - learn about Next-Lite features and API.

## Deploy

You can deploy this example to any static hosting service or Node.js hosting platform.
