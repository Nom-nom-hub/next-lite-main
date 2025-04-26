import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../../components/CartDrawer';
import { getPosts, getProducts } from '../../utils/api';

export default function HomePage() {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts and products in parallel
        const [postsData, productsData] = await Promise.all([
          getPosts(),
          getProducts()
        ]);
        
        // Get 3 featured posts
        setFeaturedPosts(postsData.slice(0, 3));
        
        // Get 4 featured products
        setFeaturedProducts(productsData.slice(0, 4));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <Layout>
      {/* Cart Drawer */}
      <CartDrawer />
      
      {/* Hero Section */}
      <section style={{
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
        color: 'white',
        padding: '4rem 1.5rem',
        borderRadius: '8px',
        margin: '0 1.5rem 3rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          zIndex: 1
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: 1.2
          }}>
            Experience the Power of Next-Lite Framework
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9
          }}>
            A lightweight, high-performance alternative to Next.js built with esbuild.
            Faster builds, smaller bundles, and a simpler architecture.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Button 
              variant="outline" 
              size="large"
              style={{ 
                backgroundColor: 'white', 
                color: theme.primary,
                borderColor: 'white'
              }}
              href="/docs"
            >
              Get Started
            </Button>
            
            <Button 
              variant="ghost" 
              size="large"
              style={{ 
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid'
              }}
              href="/about"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section style={{
        padding: '3rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto 3rem'
      }}>
        <h2 style={{
          fontSize: '2rem',
          textAlign: 'center',
          marginBottom: '3rem',
          color: theme.text
        }}>
          Why Choose Next-Lite?
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          <Card variant="elevated" hover>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                color: theme.primary
              }}>
                ⚡
              </span>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: theme.text
              }}>
                Lightning Fast
              </h3>
              <p style={{
                color: theme.text + 'cc'
              }}>
                Built with esbuild for blazing-fast build times and optimized performance.
              </p>
            </div>
          </Card>
          
          <Card variant="elevated" hover>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                color: theme.primary
              }}>
                🔍
              </span>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: theme.text
              }}>
                Lightweight
              </h3>
              <p style={{
                color: theme.text + 'cc'
              }}>
                Minimal dependencies and smaller bundle sizes for faster page loads.
              </p>
            </div>
          </Card>
          
          <Card variant="elevated" hover>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                color: theme.primary
              }}>
                🧩
              </span>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: theme.text
              }}>
                Simple Architecture
              </h3>
              <p style={{
                color: theme.text + 'cc'
              }}>
                Easy to understand and customize to fit your specific needs.
              </p>
            </div>
          </Card>
          
          <Card variant="elevated" hover>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                color: theme.primary
              }}>
                🚀
              </span>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: theme.text
              }}>
                Developer Experience
              </h3>
              <p style={{
                color: theme.text + 'cc'
              }}>
                HMR, TypeScript support, and intuitive file-based routing.
              </p>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Featured Blog Posts */}
      <section style={{
        padding: '3rem 1.5rem',
        backgroundColor: theme.card,
        margin: '0 0 3rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '2rem',
              color: theme.text
            }}>
              Latest Articles
            </h2>
            
            <Button 
              variant="outline"
              href="/blog"
            >
              View All
            </Button>
          </div>
          
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '3rem 0'
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
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: theme.error
            }}>
              {error}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {featuredPosts.map(post => (
                <Card 
                  key={post.id} 
                  variant="default" 
                  hover 
                  clickable
                  onClick={() => window.location.href = `/blog/${post.slug}`}
                >
                  <article>
                    <h3 style={{
                      fontSize: '1.25rem',
                      marginBottom: '0.75rem',
                      color: theme.text
                    }}>
                      {post.title}
                    </h3>
                    
                    <p style={{
                      fontSize: '0.875rem',
                      color: theme.text + '99',
                      marginBottom: '1rem'
                    }}>
                      By {post.author} • {new Date(post.date).toLocaleDateString()}
                    </p>
                    
                    <p style={{
                      color: theme.text + 'cc',
                      marginBottom: '1.5rem'
                    }}>
                      {post.excerpt}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}>
                      {post.tags.map(tag => (
                        <span 
                          key={tag}
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            backgroundColor: theme.primary + '11',
                            color: theme.primary,
                            borderRadius: '999px',
                            fontSize: '0.75rem'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Products */}
      <section style={{
        padding: '3rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto 3rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: theme.text
          }}>
            Featured Products
          </h2>
          
          <Button 
            variant="outline"
            href="/shop"
          >
            View All
          </Button>
        </div>
        
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '3rem 0'
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
        ) : error ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: theme.error
          }}>
            {error}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {featuredProducts.map(product => (
              <Card 
                key={product.id} 
                variant="default" 
                hover
              >
                <div>
                  <div style={{
                    height: '200px',
                    marginBottom: '1rem',
                    borderRadius: '4px',
                    overflow: 'hidden'
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
                  
                  <h3 style={{
                    fontSize: '1.25rem',
                    marginBottom: '0.5rem',
                    color: theme.text
                  }}>
                    {product.name}
                  </h3>
                  
                  <p style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: theme.primary,
                    marginBottom: '1rem'
                  }}>
                    ${product.price.toFixed(2)}
                  </p>
                  
                  <Button 
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
      
      {/* CTA Section */}
      <section style={{
        padding: '4rem 1.5rem',
        backgroundColor: theme.primary,
        color: 'white',
        textAlign: 'center',
        margin: '0 0 3rem'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '1.5rem'
          }}>
            Ready to Get Started?
          </h2>
          
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9
          }}>
            Join thousands of developers building faster websites with Next-Lite.
          </p>
          
          <Button 
            variant="outline" 
            size="large"
            style={{ 
              backgroundColor: 'white', 
              color: theme.primary,
              borderColor: 'white'
            }}
            href="/docs"
          >
            Start Building Now
          </Button>
        </div>
      </section>
    </Layout>
  );
}
