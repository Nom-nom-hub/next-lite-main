import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Image } from '../Image';

describe('Image Component', () => {
  test('renders image with correct src and alt', () => {
    render(<Image src="/test.jpg" alt="Test image" />);
    const imgElement = screen.getByTestId('image');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', '/test.jpg');
    expect(imgElement).toHaveAttribute('alt', 'Test image');
  });

  test('applies responsive layout by default', () => {
    render(<Image src="/test.jpg" alt="Test image" />);
    const container = screen.getByTestId('image').parentElement;
    expect(container).toHaveClass('responsive');
  });

  test('applies fixed layout with width and height', () => {
    render(
      <Image 
        src="/test.jpg" 
        alt="Test image" 
        layout="fixed" 
        width={200} 
        height={100} 
      />
    );
    const imgElement = screen.getByTestId('image');
    expect(imgElement).toHaveAttribute('width', '200');
    expect(imgElement).toHaveAttribute('height', '100');
  });

  test('sets loading to eager when priority is true', () => {
    render(<Image src="/test.jpg" alt="Test image" priority />);
    const imgElement = screen.getByTestId('image');
    expect(imgElement).toHaveAttribute('loading', 'eager');
  });

  test('sets loading to lazy by default', () => {
    render(<Image src="/test.jpg" alt="Test image" />);
    const imgElement = screen.getByTestId('image');
    expect(imgElement).toHaveAttribute('loading', 'lazy');
  });

  test('calls onLoad handler when image loads', () => {
    const handleLoad = jest.fn();
    render(<Image src="/test.jpg" alt="Test image" onLoad={handleLoad} />);
    const imgElement = screen.getByTestId('image');
    
    fireEvent.load(imgElement);
    expect(handleLoad).toHaveBeenCalledTimes(1);
  });

  test('calls onError handler when image fails to load', () => {
    const handleError = jest.fn();
    render(<Image src="/test.jpg" alt="Test image" onError={handleError} />);
    const imgElement = screen.getByTestId('image');
    
    fireEvent.error(imgElement);
    expect(handleError).toHaveBeenCalledTimes(1);
  });

  test('shows error fallback when image fails to load', () => {
    render(<Image src="/test.jpg" alt="Test image" />);
    const imgElement = screen.getByTestId('image');
    
    fireEvent.error(imgElement);
    
    // After error, the image should be replaced with the error fallback
    expect(screen.queryByTestId('image')).not.toBeInTheDocument();
    expect(screen.getByText('Test image')).toBeInTheDocument();
  });
});
