/**
 * Font optimization utilities for Next-Lite
 */

/**
 * Preloads fonts for faster rendering
 * @param {Array} fonts - Array of font objects
 * @param {string} fonts[].url - URL of the font
 * @param {string} fonts[].format - Format of the font (woff, woff2, etc.)
 */
export function preloadFonts(fonts) {
  if (!fonts || !Array.isArray(fonts) || fonts.length === 0) return;
  
  // Create link elements for each font
  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font.url;
    link.as = 'font';
    link.type = `font/${font.format}`;
    link.crossOrigin = 'anonymous';
    
    // Append to head
    document.head.appendChild(link);
  });
}

/**
 * Font display optimization
 * @param {string} fontFamily - Font family name
 * @param {string} fontDisplay - Font display strategy (swap, optional, fallback, block)
 */
export function optimizeFontDisplay(fontFamily, fontDisplay = 'swap') {
  // Create style element
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: '${fontFamily}';
      font-display: ${fontDisplay};
    }
  `;
  
  // Append to head
  document.head.appendChild(style);
}

/**
 * Font component for Next-Lite
 * @param {Object} props - Component props
 * @param {string} props.family - Font family name
 * @param {Array} props.src - Array of font sources
 * @param {string} props.display - Font display strategy
 * @param {string} props.weight - Font weight
 * @param {string} props.style - Font style
 */
export function Font({ family, src, display = 'swap', weight = 'normal', style = 'normal' }) {
  // Create font face CSS
  const fontFaceCSS = `
    @font-face {
      font-family: '${family}';
      font-display: ${display};
      font-weight: ${weight};
      font-style: ${style};
      src: ${src.map(s => `url('${s.url}') format('${s.format}')`).join(', ')};
    }
  `;
  
  // Return style element
  return (
    <style dangerouslySetInnerHTML={{ __html: fontFaceCSS }} />
  );
}