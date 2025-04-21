/**
 * Route group configuration for auth routes
 */
module.exports = {
  // Group name
  name: 'auth',
  
  // Group layout (optional)
  layout: 'AuthLayout',
  
  // Group metadata
  meta: {
    requiresAuth: true,
    title: 'Authentication',
  },
};
