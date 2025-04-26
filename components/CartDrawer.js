import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import Button from './Button';

export default function CartDrawer() {
  const { theme } = useTheme();
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    subtotal 
  } = useCart();
  
  if (!isCartOpen) return null;
  
  return (
    <div>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.3s ease'
        }}
        onClick={closeCart}
      />
      
      {/* Cart Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '400px',
          backgroundColor: theme.background,
          boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s ease'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 style={{ margin: 0, color: theme.text }}>Your Cart</h2>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: theme.text
            }}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>
        
        {/* Cart Items */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem'
          }}
        >
          {cart.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '2rem',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</span>
              <h3 style={{ margin: '0 0 1rem', color: theme.text }}>Your cart is empty</h3>
              <p style={{ color: theme.text + '99', marginBottom: '1.5rem' }}>
                Looks like you haven't added any products to your cart yet.
              </p>
              <Button onClick={closeCart}>Continue Shopping</Button>
            </div>
          ) : (
            <div>
              {cart.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    padding: '1rem 0',
                    borderBottom: `1px solid ${theme.border}`
                  }}
                >
                  {/* Product Image */}
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      marginRight: '1rem',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem', color: theme.text }}>{item.name}</h4>
                    <p style={{ margin: '0 0 0.5rem', color: theme.primary, fontWeight: 'bold' }}>
                      ${item.price.toFixed(2)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '0.5rem'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: 'transparent',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: theme.text
                        }}
                      >
                        -
                      </button>
                      <span
                        style={{
                          padding: '0 0.75rem',
                          color: theme.text
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: 'transparent',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: theme.text
                        }}
                      >
                        +
                      </button>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          color: theme.error,
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                style={{
                  display: 'block',
                  margin: '1rem 0',
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: theme.text + '99',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              borderTop: `1px solid ${theme.border}`,
              backgroundColor: theme.card
            }}
          >
            {/* Subtotal */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}
            >
              <span style={{ color: theme.text, fontWeight: 'bold' }}>Subtotal</span>
              <span style={{ color: theme.primary, fontWeight: 'bold' }}>${subtotal.toFixed(2)}</span>
            </div>
            
            {/* Checkout Button */}
            <Button
              variant="primary"
              fullWidth
              onClick={() => window.location.href = '/checkout'}
            >
              Proceed to Checkout
            </Button>
            
            {/* Continue Shopping */}
            <Button
              variant="outline"
              fullWidth
              onClick={closeCart}
              style={{ marginTop: '0.75rem' }}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
