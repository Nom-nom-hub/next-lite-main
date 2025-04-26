import React from 'react';
import { render, screen } from '@testing-library/react';
import { Image } from 'next-lite-framework';

describe('Image Component', () => {
  it('renders correctly with required props', () => {
    render(
      <Image
        src="/test.jpg"
        alt="Test image"
      />
    );
    
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.jpg');
  });
  
  it('applies width and height', () => {
    render(
      <Image
        src="/test.jpg"
        alt="Test image"
        width={200}
        height={100}
      />
    );
    
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('width', '200');
    expect(img).toHaveAttribute('height', '100');
  });
  
  it('applies layout styles correctly', () => {
    const { rerender } = render(
      <Image
        src="/test.jpg"
        alt="Test image"
        width={200}
        height={100}
        layout="fixed"
      />
    );
    
    // Get container div
    const container = screen.getByAltText('Test image').parentElement;
    expect(container).toHaveStyle({
      width: '200px',
      height: '100px',
      position: 'relative'
    });
    
    // Test responsive layout
    rerender(
      <Image
        src="/test.jpg"
        alt="Test image"
        layout="responsive"
      />
    );
    
    expect(container).toHaveStyle({
      display: 'block',
      position: 'relative',
      width: '100%'
    });
    
    // Test fill layout
    rerender(
      <Image
        src="/test.jpg"
        alt="Test image"
        layout="fill"
      />
    );
    
    expect(container).toHaveStyle({
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      height: '100%'
    });
    
    // Test intrinsic layout
    rerender(
      <Image
        src="/test.jpg"
        alt="Test image"
        layout="intrinsic"
      />
    );
    
    expect(container).toHaveStyle({
      position: 'relative',
      maxWidth: '100%'
    });
  });
  
  it('applies object-fit style', () => {
    render(
      <Image
        src="/test.jpg"
        alt="Test image"
        objectFit="cover"
      />
    );
    
    const img = screen.getByAltText('Test image');
    expect(img).toHaveStyle({
      objectFit: 'cover'
    });
  });
  
  it('applies loading attribute based on priority', () => {
    const { rerender } = render(
      <Image
        src="/test.jpg"
        alt="Test image"
        priority={true}
      />
    );
    
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'eager');
    
    rerender(
      <Image
        src="/test.jpg"
        alt="Test image"
        priority={false}
      />
    );
    
    expect(img).toHaveAttribute('loading', 'lazy');
  });
  
  it('applies custom className', () => {
    render(
      <Image
        src="/test.jpg"
        alt="Test image"
        className="custom-image"
      />
    );
    
    const container = screen.getByAltText('Test image').parentElement;
    expect(container).toHaveClass('custom-image');
  });
  
  it('applies custom style', () => {
    render(
      <Image
        src="/test.jpg"
        alt="Test image"
        style={{ border: '1px solid red' }}
      />
    );
    
    const container = screen.getByAltText('Test image').parentElement;
    expect(container).toHaveStyle({
      border: '1px solid red'
    });
  });
  
  it('applies blur placeholder when loading', () => {
    render(
      <Image
        src="/test.jpg"
        alt="Test image"
        placeholder="blur"
        blurDataURL="data:image/png;base64,..."
      />
    );
    
    const img = screen.getByAltText('Test image');
    
    // Mock the loading state
    Object.defineProperty(img, 'complete', { value: false });
    
    expect(img).toHaveStyle({
      filter: 'blur(20px)'
    });
  });
});
