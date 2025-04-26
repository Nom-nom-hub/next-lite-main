'use strict';

const React = require('react');
const Head = require('../head');

/**
 * Font component for optimized font loading
 * @param {Object} props - Component props
 * @param {string} props.src - Font source URL
 * @param {string} props.family - Font family name
 * @param {string} props.weight - Font weight
 * @param {string} props.style - Font style
 * @param {string} props.display - Font display strategy (auto, block, swap, fallback, optional)
 * @param {boolean} props.preload - Whether to preload the font
 * @param {string} props.variable - CSS variable name for the font
 */
function Font({
  src,
  family,
  weight = 'normal',
  style = 'normal',
  display = 'swap',
  preload = true,
  variable,
  ...props
}) {
  // Generate font-face CSS
  const fontFaceCSS = `
    @font-face {
      font-family: '${family}';
      font-style: ${style};
      font-weight: ${weight};
      font-display: ${display};
      src: url('${src}') format('${getFormatFromSrc(src)}');
      ${variable ? `font-named-instance: '${variable}';` : ''}
    }
    ${variable ? `:root { --${variable}: '${family}'; }` : ''}
  `;
  
  return React.createElement(
    Head,
    null,
    preload && React.createElement('link', {
      rel: 'preload',
      href: src,
      as: 'font',
      type: getFontMimeType(src),
      crossOrigin: 'anonymous',
      ...props
    }),
    React.createElement('style', {
      dangerouslySetInnerHTML: {
        __html: fontFaceCSS
      }
    })
  );
}

/**
 * Get the font format from the source URL
 * @param {string} src - Font source URL
 * @returns {string} - Font format
 */
function getFormatFromSrc(src) {
  if (src.endsWith('.woff2')) return 'woff2';
  if (src.endsWith('.woff')) return 'woff';
  if (src.endsWith('.ttf')) return 'truetype';
  if (src.endsWith('.otf')) return 'opentype';
  if (src.endsWith('.eot')) return 'embedded-opentype';
  if (src.endsWith('.svg')) return 'svg';
  return 'truetype';
}

/**
 * Get the font MIME type from the source URL
 * @param {string} src - Font source URL
 * @returns {string} - Font MIME type
 */
function getFontMimeType(src) {
  if (src.endsWith('.woff2')) return 'font/woff2';
  if (src.endsWith('.woff')) return 'font/woff';
  if (src.endsWith('.ttf')) return 'font/ttf';
  if (src.endsWith('.otf')) return 'font/otf';
  if (src.endsWith('.eot')) return 'application/vnd.ms-fontobject';
  if (src.endsWith('.svg')) return 'image/svg+xml';
  return 'font/ttf';
}

module.exports = {
  Font
};
