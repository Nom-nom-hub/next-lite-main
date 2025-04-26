'use strict';

const React = require('react');
const { useState, useEffect } = React;

/**
 * Image component with optimization features
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {string} props.alt - Image alt text
 * @param {string} props.layout - Image layout (fill, fixed, responsive, intrinsic)
 * @param {boolean} props.priority - Whether to prioritize loading
 * @param {string} props.quality - Image quality (1-100)
 * @param {string} props.placeholder - Placeholder type (blur, empty)
 * @param {string} props.blurDataURL - Data URL for blur placeholder
 */
function Image({
  src,
  width,
  height,
  alt = '',
  layout = 'intrinsic',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Generate optimized image URL
  const optimizedSrc = getOptimizedImageUrl(src, { width, height, quality });
  
  // Handle image load
  const handleLoad = () => {
    setLoaded(true);
  };
  
  // Handle image error
  const handleError = () => {
    setError(true);
    setLoaded(true); // Consider it "loaded" to remove placeholder
  };
  
  // Determine image styles based on layout
  const imageStyles = getImageStyles({ layout, width, height, loaded });
  
  // Determine container styles based on layout
  const containerStyles = getContainerStyles({ layout, width, height });
  
  // Determine placeholder visibility
  const showPlaceholder = !loaded && placeholder !== 'empty';
  
  // Determine placeholder styles
  const placeholderStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: showPlaceholder ? 'block' : 'none',
    ...(placeholder === 'blur' && blurDataURL ? {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url("${blurDataURL}")`
    } : {
      backgroundColor: '#f0f0f0'
    })
  };
  
  // Preload the image if priority is true
  useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedSrc;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, optimizedSrc]);
  
  return React.createElement(
    'div',
    { style: containerStyles },
    showPlaceholder && React.createElement('div', { style: placeholderStyles }),
    React.createElement('img', {
      src: error ? src : optimizedSrc, // Fallback to original src on error
      alt,
      width: layout === 'fill' ? undefined : width,
      height: layout === 'fill' ? undefined : height,
      style: imageStyles,
      onLoad: handleLoad,
      onError: handleError,
      loading: priority ? 'eager' : 'lazy',
      ...props
    })
  );
}

/**
 * Get optimized image URL
 * @param {string} src - Original image URL
 * @param {Object} options - Optimization options
 * @param {number} options.width - Image width
 * @param {number} options.height - Image height
 * @param {number} options.quality - Image quality
 * @returns {string} - Optimized image URL
 */
function getOptimizedImageUrl(src, { width, height, quality }) {
  // If src is an external URL, return it as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // If src is a data URL, return it as is
  if (src.startsWith('data:')) {
    return src;
  }
  
  // Construct the optimized image URL
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}${height ? `&h=${height}` : ''}`;
}

/**
 * Get image styles based on layout
 * @param {Object} options - Style options
 * @param {string} options.layout - Image layout
 * @param {number} options.width - Image width
 * @param {number} options.height - Image height
 * @param {boolean} options.loaded - Whether the image has loaded
 * @returns {Object} - Image styles
 */
function getImageStyles({ layout, width, height, loaded }) {
  const baseStyles = {
    opacity: loaded ? 1 : 0,
    transition: 'opacity 0.5s ease-in-out'
  };
  
  switch (layout) {
    case 'fill':
      return {
        ...baseStyles,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      };
    case 'fixed':
      return {
        ...baseStyles,
        width,
        height,
        maxWidth: '100%'
      };
    case 'responsive':
      return {
        ...baseStyles,
        width: '100%',
        height: 'auto',
        maxWidth: '100%'
      };
    case 'intrinsic':
    default:
      return {
        ...baseStyles,
        maxWidth: '100%',
        height: 'auto'
      };
  }
}

/**
 * Get container styles based on layout
 * @param {Object} options - Style options
 * @param {string} options.layout - Image layout
 * @param {number} options.width - Image width
 * @param {number} options.height - Image height
 * @returns {Object} - Container styles
 */
function getContainerStyles({ layout, width, height }) {
  switch (layout) {
    case 'fill':
      return {
        position: 'relative',
        width: '100%',
        height: '100%'
      };
    case 'fixed':
      return {
        position: 'relative',
        width,
        height
      };
    case 'responsive':
      return {
        position: 'relative',
        width: '100%',
        paddingBottom: height && width ? `${(height / width) * 100}%` : undefined
      };
    case 'intrinsic':
    default:
      return {
        position: 'relative',
        maxWidth: width,
        width: '100%'
      };
  }
}

module.exports = {
  Image
};
