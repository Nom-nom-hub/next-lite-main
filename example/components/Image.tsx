import React, { useState, useEffect } from 'react';
import styles from './Image.module.css';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout?: 'fixed' | 'responsive' | 'fill';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
}

/**
 * Optimized Image component
 * Similar to Next.js Image component but with a simpler implementation
 */
export function Image({
  src,
  alt,
  width,
  height,
  layout = 'responsive',
  objectFit = 'cover',
  quality = 75,
  priority = false,
  loading = 'lazy',
  onLoad,
  onError,
  className = '',
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Generate optimized image URL
  const optimizedSrc = getOptimizedImageUrl(src, { width, height, quality });
  
  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Handle image error
  const handleError = () => {
    setError(true);
    if (onError) onError();
  };
  
  // Determine CSS classes based on layout
  const containerClasses = [
    styles.container,
    styles[layout],
    className,
    isLoaded ? styles.loaded : '',
    error ? styles.error : '',
  ].filter(Boolean).join(' ');
  
  // Set loading attribute based on priority
  const loadingAttr = priority ? 'eager' : loading;
  
  // Set inline styles based on layout
  const containerStyle: React.CSSProperties = {};
  const imgStyle: React.CSSProperties = {
    objectFit,
  };
  
  if (layout === 'fixed' && width && height) {
    containerStyle.width = `${width}px`;
    containerStyle.height = `${height}px`;
  } else if (layout === 'responsive' && width && height) {
    containerStyle.paddingBottom = `${(height / width) * 100}%`;
  }
  
  return (
    <div className={containerClasses} style={containerStyle}>
      {!error ? (
        <img
          src={optimizedSrc}
          alt={alt}
          width={layout === 'fixed' ? width : undefined}
          height={layout === 'fixed' ? height : undefined}
          loading={loadingAttr}
          onLoad={handleLoad}
          onError={handleError}
          style={imgStyle}
          data-testid="image"
        />
      ) : (
        <div className={styles.errorFallback}>
          <span>{alt}</span>
        </div>
      )}
      
      {!isLoaded && !error && (
        <div className={styles.placeholder} aria-hidden="true">
          <div className={styles.shimmer}></div>
        </div>
      )}
    </div>
  );
}

/**
 * Generate an optimized image URL
 * In a real implementation, this would connect to an image optimization service
 */
function getOptimizedImageUrl(
  src: string,
  { width, height, quality }: { width?: number; height?: number; quality: number }
): string {
  // If using a remote image service like Cloudinary or Imgix, you would
  // transform the URL here to include optimization parameters
  
  // For local development, we'll just add query parameters
  // In production, you would use a real image optimization service
  
  // Check if the URL is external
  if (src.startsWith('http')) {
    // For demo purposes, we'll just add query parameters
    // In a real implementation, you would use a proper image optimization service
    const url = new URL(src);
    if (width) url.searchParams.append('w', width.toString());
    if (height) url.searchParams.append('h', height.toString());
    url.searchParams.append('q', quality.toString());
    return url.toString();
  }
  
  // For local images, we'll just return the original
  // In a real implementation, you would process these through an optimization service
  return src;
}
