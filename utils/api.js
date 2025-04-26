/**
 * Utility functions for API requests
 */

// Base API URL
const API_BASE_URL = '/api';

/**
 * Generic fetch function with error handling
 */
export async function fetchAPI(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred while fetching data');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Get all blog posts
 */
export async function getPosts() {
  return fetchAPI('/posts');
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug) {
  return fetchAPI(`/posts?slug=${slug}`);
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag) {
  return fetchAPI(`/posts?tag=${tag}`);
}

/**
 * Get all products
 */
export async function getProducts() {
  return fetchAPI('/products');
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug) {
  return fetchAPI(`/products?slug=${slug}`);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category) {
  return fetchAPI(`/products?category=${category}`);
}

/**
 * Login user
 */
export async function loginUser(credentials) {
  return fetchAPI('/users?action=login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

/**
 * Get user profile
 */
export async function getUserProfile(username) {
  return fetchAPI(`/users?username=${username}`);
}

/**
 * Get all users (admin only)
 */
export async function getUsers(token) {
  return fetchAPI('/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}
