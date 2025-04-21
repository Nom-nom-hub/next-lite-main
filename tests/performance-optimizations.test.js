/**
 * Tests for performance optimizations
 */
const {
  codeSplittingPlugin,
  treeShakingPlugin,
  compressionPlugin,
  analyzeBundleSize,
  generateBundleReport,
  optimizeImages,
} = require('../scripts/performance-optimizations');

// Mock fs-extra
jest.mock('fs-extra', () => ({
  readFile: jest.fn(() => Promise.resolve('const a = 1; export const b = 2;')),
  writeFile: jest.fn(() => Promise.resolve()),
  readdir: jest.fn(() => Promise.resolve([
    { name: 'file1.js', isDirectory: () => false, isFile: () => true },
    { name: 'file2.css', isDirectory: () => false, isFile: () => true },
    { name: 'dir', isDirectory: () => true, isFile: () => false },
  ])),
  ensureDir: jest.fn(() => Promise.resolve()),
}));

// Mock zlib
jest.mock('zlib', () => ({
  gzip: jest.fn((content, callback) => callback(null, Buffer.from('gzipped'))),
  brotliCompress: jest.fn((content, callback) => callback(null, Buffer.from('brotlied'))),
}));

describe('Performance Optimizations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('codeSplittingPlugin creates a valid plugin', () => {
    const plugin = codeSplittingPlugin();
    
    expect(plugin).toEqual({
      name: 'code-splitting',
      setup: expect.any(Function),
    });
  });
  
  test('treeShakingPlugin creates a valid plugin', () => {
    const plugin = treeShakingPlugin();
    
    expect(plugin).toEqual({
      name: 'tree-shaking',
      setup: expect.any(Function),
    });
  });
  
  test('compressionPlugin creates a valid plugin', () => {
    const plugin = compressionPlugin();
    
    expect(plugin).toEqual({
      name: 'compression',
      setup: expect.any(Function),
    });
  });
  
  test('analyzeBundleSize analyzes bundle size', async () => {
    const fs = require('fs-extra');
    
    const result = await analyzeBundleSize('path/to/bundle.js');
    
    expect(fs.readFile).toHaveBeenCalledWith('path/to/bundle.js', 'utf8');
    expect(result).toEqual({
      size: 27,
      lines: 1,
      dependencies: [],
    });
  });
  
  test('generateBundleReport generates a report', async () => {
    const fs = require('fs-extra');
    
    await generateBundleReport('dist');
    
    expect(fs.readdir).toHaveBeenCalled();
    expect(fs.readFile).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalled();
  });
  
  test('optimizeImages optimizes images', async () => {
    const fs = require('fs-extra');
    
    // Mock readdir to return image files
    fs.readdir.mockImplementationOnce(() => Promise.resolve([
      { name: 'image1.jpg', isDirectory: () => false, isFile: () => true },
      { name: 'image2.png', isDirectory: () => false, isFile: () => true },
      { name: 'dir', isDirectory: () => true, isFile: () => false },
    ]));
    
    await optimizeImages('public');
    
    expect(fs.readdir).toHaveBeenCalled();
  });
});
