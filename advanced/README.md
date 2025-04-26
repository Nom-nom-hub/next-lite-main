# Next-Lite Advanced Demo

This is an advanced demo of the Next-Lite framework, showcasing its capabilities for building sophisticated web applications.

## Features

- **Data Fetching & API Integration**: Mock API endpoints with realistic data
- **Client-side State Management**: Context API for auth, cart, and theme
- **Advanced Routing with Parameters**: Dynamic routes for blog posts and products
- **Authentication System**: Simulated login/logout functionality
- **Dynamic Content Loading**: Async data loading with loading states
- **Animations and Transitions**: Smooth UI transitions and loading animations
- **Responsive Design with Dark Mode**: Theme switching and responsive layouts
- **Form Validation and Handling**: Input validation and form submission

## Running the Demo

1. Install dependencies:
   ```
   npx flash-install
   ```

2. Start the development server:
   ```
   node advanced/dev-server.js
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3002
   ```

## Demo Credentials

You can log in with the following credentials:

- **Username**: johndoe
- **Password**: password123

## Project Structure

- `advanced/pages/`: All page components
- `advanced/components/`: Reusable UI components
- `advanced/context/`: Context providers for state management
- `advanced/utils/`: Utility functions
- `advanced/pages/api/`: Mock API endpoints

## Technologies Used

- React 18
- Context API for state management
- CSS-in-JS for styling
- esbuild for bundling
- WebSockets for HMR

## Notes

This is a demonstration of what's possible with Next-Lite. In a production environment, you would want to:

1. Implement proper server-side rendering
2. Add proper error boundaries
3. Implement real authentication
4. Add comprehensive testing
5. Optimize for production builds
