import fs from 'fs';
import path from 'path';
import { NextLiteConfig } from '../types';

// Default configuration
const defaultConfig: NextLiteConfig = {
  server: {
    port: 3000,
    host: 'localhost'
  },
  build: {
    target: ['es2015'],
    minify: true,
    sourcemap: true,
    outDir: '.next'
  },
  images: {
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    path: '/_next/image',
    loader: 'default'
  },
  experimental: {
    ssr: false,
    concurrentFeatures: false,
    optimizeCss: false,
    scrollRestoration: false
  }
};

// Load configuration from next-lite.config.js
export function loadConfig(configPath?: string): NextLiteConfig {
  const configFile = configPath || path.join(process.cwd(), 'next-lite.config.js');
  
  try {
    if (fs.existsSync(configFile)) {
      // Load user config
      const userConfig = require(configFile);
      
      // Merge with default config
      return {
        ...defaultConfig,
        ...userConfig,
        server: {
          ...defaultConfig.server,
          ...userConfig.server
        },
        build: {
          ...defaultConfig.build,
          ...userConfig.build
        },
        images: {
          ...defaultConfig.images,
          ...userConfig.images
        },
        experimental: {
          ...defaultConfig.experimental,
          ...userConfig.experimental
        }
      };
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  
  return defaultConfig;
}
