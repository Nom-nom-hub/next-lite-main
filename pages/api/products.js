// Sample products data
const products = [
  {
    id: 1,
    name: "Next-Lite Pro License",
    slug: "next-lite-pro-license",
    description: "Professional license for Next-Lite framework with premium support and features.",
    price: 99.99,
    category: "software",
    image: "https://via.placeholder.com/300x200?text=Next-Lite+Pro",
    features: [
      "Priority support",
      "Advanced build optimizations",
      "Custom plugins",
      "Team collaboration tools"
    ],
    stock: 999
  },
  {
    id: 2,
    name: "Developer Laptop",
    slug: "developer-laptop",
    description: "High-performance laptop optimized for web development and coding.",
    price: 1299.99,
    category: "hardware",
    image: "https://via.placeholder.com/300x200?text=Developer+Laptop",
    features: [
      "16GB RAM",
      "512GB SSD",
      "15.6\" 4K Display",
      "Latest CPU",
      "Developer-friendly keyboard"
    ],
    stock: 15
  },
  {
    id: 3,
    name: "Web Development Course",
    slug: "web-development-course",
    description: "Comprehensive course on modern web development with Next-Lite.",
    price: 49.99,
    category: "education",
    image: "https://via.placeholder.com/300x200?text=Web+Dev+Course",
    features: [
      "50+ hours of content",
      "Hands-on projects",
      "Certificate of completion",
      "Community access"
    ],
    stock: 999
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    slug: "mechanical-keyboard",
    description: "Premium mechanical keyboard for developers with customizable keys.",
    price: 129.99,
    category: "hardware",
    image: "https://via.placeholder.com/300x200?text=Mechanical+Keyboard",
    features: [
      "Cherry MX switches",
      "RGB backlighting",
      "Programmable macros",
      "Ergonomic design"
    ],
    stock: 42
  },
  {
    id: 5,
    name: "Cloud Hosting Plan",
    slug: "cloud-hosting-plan",
    description: "High-performance cloud hosting optimized for Next-Lite applications.",
    price: 19.99,
    category: "service",
    image: "https://via.placeholder.com/300x200?text=Cloud+Hosting",
    features: [
      "99.9% uptime guarantee",
      "Automatic scaling",
      "Global CDN",
      "Free SSL certificates"
    ],
    stock: 999
  }
];

// API handler
module.exports = (req, res) => {
  const { method, query } = req;
  
  // GET all products or a single product
  if (method === 'GET') {
    // If slug is provided, return a single product
    if (query.slug) {
      const product = products.find(p => p.slug === query.slug);
      
      if (product) {
        return res.json(product);
      } else {
        return res.status(404).json({ error: 'Product not found' });
      }
    }
    
    // If category is provided, filter products by category
    if (query.category) {
      const filteredProducts = products.filter(product => 
        product.category === query.category
      );
      
      return res.json(filteredProducts);
    }
    
    // Return all products
    return res.json(products);
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
};
