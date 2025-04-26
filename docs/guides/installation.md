# Installing Next-Lite

This guide will walk you through the process of installing Next-Lite and creating a new project.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js 14.0.0 or later
- npm, yarn, pnpm, or flash-install

## Creating a New Next-Lite Project

The easiest way to get started with Next-Lite is by using `create-next-lite-app`:

```bash
npx create-next-lite-app my-app
```

This will create a new Next-Lite project in the `my-app` directory with the default template.

### Using TypeScript

To create a TypeScript project, use the `--typescript` flag:

```bash
npx create-next-lite-app my-app --typescript
```

### Using Different Package Managers

You can specify your preferred package manager:

```bash
# Using yarn
npx create-next-lite-app my-app --use-yarn

# Using pnpm
npx create-next-lite-app my-app --use-pnpm

# Using flash-install (fastest)
npx create-next-lite-app my-app --use-flash
```

### Using Templates

You can create a project from a specific template:

```bash
npx create-next-lite-app my-app --template [template-name]
```

### Using Examples

You can create a project from an example in the Next-Lite repository:

```bash
npx create-next-lite-app my-app --example [example-name]
```

## Manual Installation

If you prefer to set up a Next-Lite project manually, follow these steps:

1. Create a new directory for your project:

```bash
mkdir my-app
cd my-app
```

2. Initialize a new npm project:

```bash
npm init -y
```

3. Install Next-Lite and React:

```bash
npm install next-lite-framework react react-dom
```

4. Add scripts to your package.json:

```json
{
  "scripts": {
    "dev": "next-lite dev",
    "build": "next-lite build",
    "start": "next-lite start"
  }
}
```

5. Create a basic project structure:

```bash
mkdir -p pages public styles
```

6. Create a basic page:

```jsx
// pages/index.js
import React from 'react';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Next-Lite!</h1>
    </div>
  );
}
```

## Supercharged Installation with flash-install

For even faster dependency installation, we recommend using [flash-install](https://www.npmjs.com/package/@flash-install/cli):

```bash
# Install flash-install globally (one-time setup)
npm install -g @flash-install/cli

# Use flash-direct instead of npm install
flash-direct install

# Or create a snapshot for future installations
flash-install snapshot

# Restore from snapshot (ultra-fast)
flash-install restore
```

## Verifying Your Installation

After creating your project, you can verify that everything is working correctly:

```bash
cd my-app
npm run dev
```

This will start the development server. Open [http://localhost:3000](http://localhost:3000) in your browser to see your application.

## Next Steps

- [Project Structure](./project-structure.md) - Learn about the Next-Lite project structure
- [Quick Start](./quick-start.md) - Get up and running quickly
- [Examples](../../examples) - Explore example Next-Lite applications
