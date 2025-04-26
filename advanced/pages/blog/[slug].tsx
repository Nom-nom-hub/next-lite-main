import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import { useTheme } from '../../../context/ThemeContext';
import { getPostBySlug, getPostsByTag } from '../../../utils/api';

export default function BlogPostPage() {
  const { theme } = useTheme();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get slug from URL
  const getSlug = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const slugMatch = path.match(/\/blog\/(.+)/);
      return slugMatch ? slugMatch[1] : null;
    }
    return null;
  };
  
  // Fetch post data on mount
  useEffect(() => {
    const fetchData = async () => {
      const slug = getSlug();
      
      if (!slug) {
        setError('Post not found');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch post data
        const postData = await getPostBySlug(slug);
        setPost(postData);
        
        // Fetch related posts based on first tag
        if (postData.tags && postData.tags.length > 0) {
          const tag = postData.tags[0];
          const relatedData = await getPostsByTag(tag);
          
          // Filter out current post and limit to 3 posts
          const filteredRelated = relatedData
            .filter(p => p.id !== postData.id)
            .slice(0, 3);
            
          setRelatedPosts(filteredRelated);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Render markdown content
  const renderMarkdown = (content) => {
    // This is a very simple markdown renderer
    // In a real app, you would use a proper markdown library
    
    // Convert headers
    let html = content
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>');
      
    // Convert paragraphs (simple version)
    html = html.replace(/^(?!<h[1-6]>)(.*$)/gm, function(match) {
      if (match.trim() === '') return '';
      return '<p>' + match + '</p>';
    });
    
    // Convert code blocks
    html = html.replace(/\`\`\`([a-z]*)\n([\s\S]*?)\n\`\`\`/gm, 
      '<pre><code class="language-$1">$2</code></pre>'
    );
    
    // Convert inline code
    html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
    
    // Convert bold
    html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic
    html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
    
    return html;
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
  
  if (error || !post) {
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
            {error || 'Post not found'}
          </h1>
          <p style={{
            marginBottom: '2rem',
            color: theme.text + 'cc'
          }}>
            The blog post you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button 
            variant="primary"
            href="/blog"
          >
            Back to Blog
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      {/* Blog Post Header */}
      <header style={{
        padding: '3rem 1.5rem',
        backgroundColor: theme.card,
        marginBottom: '2rem'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem'
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
          
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '1.5rem',
            color: theme.text
          }}>
            {post.title}
          </h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: theme.primary + '33',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem',
              fontSize: '1.25rem'
            }}>
              {post.author.charAt(0)}
            </div>
            
            <div>
              <p style={{
                fontWeight: 'bold',
                color: theme.text,
                margin: 0
              }}>
                {post.author}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: theme.text + '99',
                margin: 0
              }}>
                {formatDate(post.date)} • {post.content.length / 1000 | 0} min read
              </p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Blog Post Content */}
      <article style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 1.5rem 3rem'
      }}>
        <div 
          style={{
            color: theme.text,
            lineHeight: 1.6
          }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
      </article>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section style={{
          padding: '3rem 1.5rem',
          backgroundColor: theme.card,
          margin: '2rem 0'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              marginBottom: '2rem',
              color: theme.text
            }}>
              Related Articles
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {relatedPosts.map(relatedPost => (
                <Card 
                  key={relatedPost.id} 
                  variant="default" 
                  hover 
                  clickable
                  onClick={() => window.location.href = `/blog/${relatedPost.slug}`}
                >
                  <article>
                    <h3 style={{
                      fontSize: '1.25rem',
                      marginBottom: '0.75rem',
                      color: theme.text
                    }}>
                      {relatedPost.title}
                    </h3>
                    
                    <p style={{
                      fontSize: '0.875rem',
                      color: theme.text + '99',
                      marginBottom: '1rem'
                    }}>
                      By {relatedPost.author} • {formatDate(relatedPost.date)}
                    </p>
                    
                    <p style={{
                      color: theme.text + 'cc',
                      marginBottom: '1.5rem'
                    }}>
                      {relatedPost.excerpt}
                    </p>
                  </article>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Call to Action */}
      <section style={{
        padding: '3rem 1.5rem',
        maxWidth: '800px',
        margin: '0 auto 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          marginBottom: '1rem',
          color: theme.text
        }}>
          Enjoyed this article?
        </h2>
        
        <p style={{
          marginBottom: '2rem',
          color: theme.text + 'cc'
        }}>
          Check out more articles about web development, performance optimization, and Next-Lite framework.
        </p>
        
        <Button 
          variant="primary"
          href="/blog"
        >
          Explore More Articles
        </Button>
      </section>
    </Layout>
  );
}
