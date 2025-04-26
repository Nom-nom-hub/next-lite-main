import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';
import CartDrawer from '../../../components/CartDrawer';
import { getProductBySlug, getProductsByCategory } from '../../../utils/api';

export default function ProductPage() {
  const { theme } = useTheme();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Get slug from URL
  const getSlug = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const slugMatch = path.match(/\/shop\/(.+)/);
      return slugMatch ? slugMatch[1] : null;
    }
    return null;
  };
  
  // Fetch product data on mount
  useEffect(() => {
    const fetchData = async () => {
      const slug = getSlug();
      
      if (!slug) {
        setError('Product not found');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch product data
        const productData = await getProductBySlug(slug);
        setProduct(productData);
        
        // Fetch related products based on category
        if (productData.category) {
          const relatedData = await getProductsByCategory(productData.category);
          
          // Filter out current product and limit to 4 products
          const filteredRelated = relatedData
            .filter(p => p.id !== productData.id)
            .slice(0, 4);
            
          setRelatedProducts(filteredRelated);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Check if product is in cart
  useEffect(() => {
    if (product && cart.some(item => item.id === product.id)) {
      setAddedToCart(true);
    } else {
      setAddedToCart(false);
    }
  }, [product, cart]);
  
  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.stock) return;
    setQuantity(newQuantity);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
        }}>
          <div style={{
            display: 'inline-block',
            width: '50px',
            height: '50px',
            border: `3px solid ${theme.border}`,
            borderRadius: '50%',
            borderTopColor: theme.primary,
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      </Layout>
    );
  }
  
  if (error || !product) {
    return (
      <Layout>
        <div style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '1.5rem',
            color: theme.text
          }}>
            {error || 'Product not found'}
          </h1>
          <p style={{
            marginBottom: '2rem',
            color: theme.text + 'cc'
          }}>
            The product you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button 
            variant="primary"
            href="/shop"
          >
            Back to Shop
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      {/* Cart Drawer */}
      <CartDrawer />
      
      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 1.5rem'
      }}>
        {/* Breadcrumbs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          color: theme.text + '99',
          fontSize: '0.875rem'
        }}>
          <a 
            href="/"
            style={{
              color: theme.text + '99',
              textDecoration: 'none'
            }}
          >
            Home
          </a>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <a 
            href="/shop"
            style={{
              color: theme.text + '99',
              textDecoration: 'none'
            }}
          >
            Shop
          </a>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <a 
            href={`/shop?category=${product.category}`}
            style={{
              color: theme.text + '99',
              textDecoration: 'none'
            }}
          >
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </a>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span style={{ color: theme.text }}>
            {product.name}
          </span>
        </div>
        
        {/* Product Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr', '1fr 1fr'],
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Product Image */}
          <div>
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              height: '400px'
            }}>
              <img 
                src={product.image} 
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              color: theme.text
            }}>
              {product.name}
            </h1>
            
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: theme.primary,
              marginBottom: '1.5rem'
            }}>
              ${product.price.toFixed(2)}
            </p>
            
            <div style={{
              marginBottom: '1.5rem'
            }}>
              <p style={{
                color: theme.text + 'cc',
                lineHeight: 1.6
              }}>
                {product.description}
              </p>
            </div>
            
            {/* Features */}
            <div style={{
              marginBottom: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                marginBottom: '1rem',
                color: theme.text
              }}>
                Features
              </h3>
              
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {product.features.map((feature, index) => (
                  <li 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                      color: theme.text + 'cc'
                    }}
                  >
                    <span style={{
                      color: theme.primary,
                      marginRight: '0.5rem'
                    }}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Stock Status */}
            <div style={{
              marginBottom: '1.5rem'
            }}>
              <p style={{
                color: product.stock > 0 ? theme.success : theme.error,
                fontWeight: 'bold'
              }}>
                {product.stock > 0 
                  ? `In Stock (${product.stock} available)` 
                  : 'Out of Stock'}
              </p>
            </div>
            
            {/* Quantity Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <span style={{
                marginRight: '1rem',
                color: theme.text
              }}>
                Quantity:
              </span>
              
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: 'transparent',
                    borderRadius: '4px 0 0 4px',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    color: theme.text,
                    opacity: quantity <= 1 ? 0.5 : 1
                  }}
                >
                  -
                </button>
                
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  style={{
                    width: '50px',
                    height: '36px',
                    border: `1px solid ${theme.border}`,
                    borderLeft: 'none',
                    borderRight: 'none',
                    textAlign: 'center',
                    backgroundColor: theme.background,
                    color: theme.text
                  }}
                />
                
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: 'transparent',
                    borderRadius: '0 4px 4px 0',
                    cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                    color: theme.text,
                    opacity: quantity >= product.stock ? 0.5 : 1
                  }}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <Button 
                variant={addedToCart ? 'success' : 'primary'}
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                style={{ flex: 1 }}
              >
                {addedToCart ? 'Added to Cart' : 'Add to Cart'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  handleAddToCart();
                  window.location.href = '/checkout';
                }}
                disabled={product.stock <= 0}
                style={{ flex: 1 }}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section style={{
            marginTop: '3rem',
            marginBottom: '3rem'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              marginBottom: '2rem',
              color: theme.text
            }}>
              Related Products
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              {relatedProducts.map(relatedProduct => (
                <Card 
                  key={relatedProduct.id} 
                  variant="default" 
                  hover
                  clickable
                  onClick={() => window.location.href = `/shop/${relatedProduct.slug}`}
                >
                  <div>
                    <div style={{
                      height: '200px',
                      marginBottom: '1rem',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    
                    <h3 style={{
                      fontSize: '1.25rem',
                      marginBottom: '0.5rem',
                      color: theme.text
                    }}>
                      {relatedProduct.name}
                    </h3>
                    
                    <p style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: theme.primary,
                      marginBottom: '1rem'
                    }}>
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                    
                    <Button 
                      variant="primary"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(relatedProduct);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
