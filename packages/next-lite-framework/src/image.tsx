import React, { useState, useEffect } from 'react';

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout?: 'fixed' | 'responsive' | 'fill' | 'intrinsic';
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export function Image({
  src,
  alt,
  width,
  height,
  layout = 'intrinsic',
  objectFit,
  quality = 75,
  priority = false,
  loading = 'lazy',
  placeholder = 'empty',
  blurDataURL,
  className,
  style,
  onLoad,
  onError
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate optimized image URL
  const getOptimizedSrc = () => {
    // In a real implementation, this would generate an optimized image URL
    // For now, just return the original src
    return src;
  };
  
  // Handle image loading
  const handleLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
    if (onLoad) onLoad();
  };
  
  // Handle image error
  const handleError = () => {
    setIsLoading(false);
    if (onError) onError();
  };
  
  // Preload image if priority is true
  useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      const img = new Image();
      img.src = getOptimizedSrc();
    }
  }, [priority, src]);
  
  // Generate container style based on layout
  const getContainerStyle = (): React.CSSProperties => {
    const containerStyle: React.CSSProperties = { ...style };
    
    switch (layout) {
      case 'fixed':
        containerStyle.width = width;
        containerStyle.height = height;
        containerStyle.position = 'relative';
        break;
      case 'responsive':
        containerStyle.display = 'block';
        containerStyle.position = 'relative';
        containerStyle.width = '100%';
        break;
      case 'fill':
        containerStyle.position = 'absolute';
        containerStyle.top = 0;
        containerStyle.left = 0;
        containerStyle.bottom = 0;
        containerStyle.right = 0;
        containerStyle.width = '100%';
        containerStyle.height = '100%';
        break;
      case 'intrinsic':
        containerStyle.position = 'relative';
        containerStyle.maxWidth = '100%';
        break;
    }
    
    return containerStyle;
  };
  
  // Generate image style based on layout and objectFit
  const getImageStyle = (): React.CSSProperties => {
    const imageStyle: React.CSSProperties = {};
    
    switch (layout) {
      case 'fixed':
        imageStyle.width = width;
        imageStyle.height = height;
        break;
      case 'responsive':
      case 'fill':
        imageStyle.width = '100%';
        imageStyle.height = '100%';
        break;
      case 'intrinsic':
        imageStyle.maxWidth = '100%';
        imageStyle.height = 'auto';
        break;
    }
    
    if (objectFit) {
      imageStyle.objectFit = objectFit;
    }
    
    if (placeholder === 'blur' && blurDataURL && isLoading) {
      imageStyle.filter = 'blur(20px)';
      imageStyle.backgroundSize = 'cover';
      imageStyle.backgroundPosition = 'center';
      imageStyle.backgroundRepeat = 'no-repeat';
      imageStyle.backgroundImage = `url(${blurDataURL})`;
    }
    
    return imageStyle;
  };
  
  return (
    <div
      className={className}
      style={getContainerStyle()}
    >
      <img
        src={getOptimizedSrc()}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        style={getImageStyle()}
      />
    </div>
  );
}
