'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const url = require('url');
const crypto = require('crypto');
const { promisify } = require('util');
const { createCanvas, loadImage } = require('canvas');

// Promisify fs functions
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

// Cache directory
const CACHE_DIR = path.join(process.cwd(), '.next', 'cache', 'images');

/**
 * Optimize an image
 * @param {Object} options - Optimization options
 * @param {string} options.src - Image source URL or path
 * @param {number} options.width - Target width
 * @param {number} options.height - Target height (optional)
 * @param {number} options.quality - Image quality (1-100)
 * @returns {Promise<Buffer>} - Optimized image buffer
 */
async function optimizeImage({ src, width, height, quality = 75 }) {
  // Create cache directory if it doesn't exist
  await mkdir(CACHE_DIR, { recursive: true });
  
  // Generate cache key
  const cacheKey = generateCacheKey({ src, width, height, quality });
  const cachePath = path.join(CACHE_DIR, cacheKey);
  
  // Check if image is already cached
  try {
    const cachedImage = await readFile(cachePath);
    return cachedImage;
  } catch (error) {
    // Image not cached, continue with optimization
  }
  
  // Load the image
  const imageBuffer = await loadImageBuffer(src);
  
  // Optimize the image
  const optimizedBuffer = await resizeAndOptimizeImage(imageBuffer, { width, height, quality });
  
  // Cache the optimized image
  await writeFile(cachePath, optimizedBuffer);
  
  return optimizedBuffer;
}

/**
 * Generate a cache key for an image
 * @param {Object} options - Image options
 * @param {string} options.src - Image source
 * @param {number} options.width - Image width
 * @param {number} options.height - Image height
 * @param {number} options.quality - Image quality
 * @returns {string} - Cache key
 */
function generateCacheKey({ src, width, height, quality }) {
  const hash = crypto.createHash('md5');
  hash.update(src);
  hash.update(String(width));
  hash.update(String(height || ''));
  hash.update(String(quality));
  return hash.digest('hex') + '.webp';
}

/**
 * Load an image buffer from a URL or file path
 * @param {string} src - Image source URL or path
 * @returns {Promise<Buffer>} - Image buffer
 */
async function loadImageBuffer(src) {
  // If src is a URL, fetch it
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return await fetchImage(src);
  }
  
  // If src is a file path, read it
  const filePath = path.isAbsolute(src) ? src : path.join(process.cwd(), 'public', src);
  return await readFile(filePath);
}

/**
 * Fetch an image from a URL
 * @param {string} imageUrl - Image URL
 * @returns {Promise<Buffer>} - Image buffer
 */
function fetchImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(imageUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = protocol.get(imageUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch image: ${res.statusCode}`));
        return;
      }
      
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    
    req.on('error', reject);
    req.end();
  });
}

/**
 * Resize and optimize an image
 * @param {Buffer} buffer - Image buffer
 * @param {Object} options - Optimization options
 * @param {number} options.width - Target width
 * @param {number} options.height - Target height (optional)
 * @param {number} options.quality - Image quality (1-100)
 * @returns {Promise<Buffer>} - Optimized image buffer
 */
async function resizeAndOptimizeImage(buffer, { width, height, quality }) {
  try {
    // Load the image
    const image = await loadImage(buffer);
    
    // Calculate dimensions
    const aspectRatio = image.width / image.height;
    const targetWidth = width;
    const targetHeight = height || Math.round(width / aspectRatio);
    
    // Create canvas
    const canvas = createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');
    
    // Draw image on canvas
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
    
    // Convert to WebP
    const webpBuffer = canvas.toBuffer('image/webp', { quality: quality / 100 });
    
    return webpBuffer;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return buffer; // Return original buffer on error
  }
}

/**
 * Handle image optimization requests
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
async function handleImageRequest(req, res) {
  try {
    const { query } = url.parse(req.url, true);
    const { url: src, w: width, h: height, q: quality } = query;
    
    if (!src || !width) {
      res.statusCode = 400;
      res.end('Missing required parameters: url, w');
      return;
    }
    
    // Parse parameters
    const parsedWidth = parseInt(width, 10);
    const parsedHeight = height ? parseInt(height, 10) : undefined;
    const parsedQuality = quality ? parseInt(quality, 10) : 75;
    
    // Validate parameters
    if (isNaN(parsedWidth) || parsedWidth <= 0 || parsedWidth > 3840) {
      res.statusCode = 400;
      res.end('Invalid width parameter');
      return;
    }
    
    if (parsedHeight !== undefined && (isNaN(parsedHeight) || parsedHeight <= 0 || parsedHeight > 2160)) {
      res.statusCode = 400;
      res.end('Invalid height parameter');
      return;
    }
    
    if (isNaN(parsedQuality) || parsedQuality < 1 || parsedQuality > 100) {
      res.statusCode = 400;
      res.end('Invalid quality parameter');
      return;
    }
    
    // Optimize the image
    const optimizedBuffer = await optimizeImage({
      src: decodeURIComponent(src),
      width: parsedWidth,
      height: parsedHeight,
      quality: parsedQuality
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Length', optimizedBuffer.length);
    
    // Send the optimized image
    res.end(optimizedBuffer);
  } catch (error) {
    console.error('Error handling image request:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

module.exports = {
  optimizeImage,
  handleImageRequest
};
