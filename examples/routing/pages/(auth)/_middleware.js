/**
 * Middleware for auth routes
 * This middleware checks if the user is authenticated
 */
module.exports = (context, next) => {
  console.log('Auth middleware running for path:', context.path);
  
  // In a real app, you would check if the user is authenticated
  // For this example, we'll just simulate authentication
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to login page
    window.location.href = '/login?redirect=' + encodeURIComponent(context.path);
    return;
  }
  
  // User is authenticated, continue to the route
  next();
};
