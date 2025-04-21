# Next-Lite with Redux

This example shows how to integrate [Redux](https://redux.js.org) and [Redux Toolkit](https://redux-toolkit.js.org) with Next-Lite.

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

This example uses Redux Toolkit to create a store with two slices:

1. **Counter Slice**: A simple counter with increment, decrement, and increment by amount actions.
2. **Todos Slice**: A todo list with add, toggle, and remove actions, plus async thunks for fetching and adding todos.

The Redux store is provided to the application using the `Provider` component from `react-redux` in the `_app.tsx` file.

### Files

- `store/index.ts`: Redux store configuration
- `store/slices/counterSlice.ts`: Counter slice with actions and reducer
- `store/slices/todosSlice.ts`: Todos slice with actions, reducer, and async thunks
- `components/Counter.tsx`: Counter component using Redux
- `components/TodoList.tsx`: Todo list component using Redux
- `pages/_app.tsx`: Application wrapper with Redux provider

### Dependencies

- `redux`: State management library
- `react-redux`: React bindings for Redux
- `@reduxjs/toolkit`: Toolset for efficient Redux development

## Learn More

To learn more about Redux and Redux Toolkit, take a look at the following resources:

- [Redux Documentation](https://redux.js.org) - learn about Redux.
- [Redux Toolkit Documentation](https://redux-toolkit.js.org) - learn about Redux Toolkit.
- [React Redux Documentation](https://react-redux.js.org) - learn about React Redux.
- [Next-Lite Documentation](https://github.com/teckcode/next-lite/tree/main/docs) - learn about Next-Lite features and API.

## Deploy

You can deploy this example to any static hosting service or Node.js hosting platform.
