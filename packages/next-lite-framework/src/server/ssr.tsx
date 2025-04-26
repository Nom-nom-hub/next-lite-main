import React from 'react';
import { renderToString } from 'react-dom/server';
import fs from 'fs-extra';
import path from 'path';
import { HeadProvider } from '../head';
import { RouterProvider } from '../router';
import { NextApiRequest, NextApiResponse, GetServerSideProps, GetStaticProps, GetStaticPaths } from '../types';

interface RenderPageOptions {
  req: NextApiRequest;
  res: NextApiResponse;
  pathname: string;
  query: Record<string, string | string[]>;
}

/**
 * Server-side render a page
 */
export async function renderPage({ req, res, pathname, query }: RenderPageOptions): Promise<string> {
  try {
    // Get page component
    const pagePath = getPagePath(pathname);
    
    if (!pagePath) {
      throw new Error(`Page not found: ${pathname}`);
    }
    
    // Import page component
    const Page = require(pagePath).default;
    
    // Check if page has getServerSideProps
    const getServerSideProps: GetServerSideProps | undefined = Page.getServerSideProps;
    
    // Check if page has getStaticProps
    const getStaticProps: GetStaticProps | undefined = Page.getStaticProps;
    
    // Get page props
    let pageProps = {};
    
    if (getServerSideProps) {
      // Call getServerSideProps
      const result = await getServerSideProps({
        req,
        res,
        params: {}, // TODO: Extract params from pathname
        query,
        preview: false,
        previewData: undefined
      });
      
      // Handle notFound
      if (result.notFound) {
        res.statusCode = 404;
        return renderNotFound();
      }
      
      // Set props
      pageProps = result.props;
    } else if (getStaticProps) {
      // Call getStaticProps
      const result = await getStaticProps({
        params: {}, // TODO: Extract params from pathname
        preview: false,
        previewData: undefined
      });
      
      // Handle notFound
      if (result.notFound) {
        res.statusCode = 404;
        return renderNotFound();
      }
      
      // Set props
      pageProps = result.props;
    }
    
    // Render page
    const html = renderToString(
      <HeadProvider>
        <RouterProvider>
          <Page {...pageProps} />
        </RouterProvider>
      </HeadProvider>
    );
    
    return html;
  } catch (error) {
    console.error('Error rendering page:', error);
    res.statusCode = 500;
    return renderError(error);
  }
}

/**
 * Get page file path from pathname
 */
function getPagePath(pathname: string): string | null {
  // Convert pathname to page path
  let pagePath = pathname;
  
  // Handle root path
  if (pathname === '/') {
    pagePath = '/index';
  }
  
  // Check if page exists
  const pagesDir = path.join(process.cwd(), 'pages');
  const pageFile = path.join(pagesDir, `${pagePath}.js`);
  const pageFileTs = path.join(pagesDir, `${pagePath}.tsx`);
  const pageFileJsx = path.join(pagesDir, `${pagePath}.jsx`);
  const pageFileTs2 = path.join(pagesDir, `${pagePath}.ts`);
  
  if (fs.existsSync(pageFile)) {
    return pageFile;
  }
  
  if (fs.existsSync(pageFileTs)) {
    return pageFileTs;
  }
  
  if (fs.existsSync(pageFileJsx)) {
    return pageFileJsx;
  }
  
  if (fs.existsSync(pageFileTs2)) {
    return pageFileTs2;
  }
  
  return null;
}

/**
 * Render 404 page
 */
function renderNotFound(): string {
  return `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    ">
      <h1 style="font-size: 2rem; margin-bottom: 1rem;">404 - Page Not Found</h1>
      <p style="font-size: 1.2rem; color: #666;">The page you are looking for does not exist.</p>
      <a href="/" style="
        margin-top: 2rem;
        padding: 0.75rem 1.5rem;
        background-color: #0070f3;
        color: white;
        text-decoration: none;
        border-radius: 4px;
      ">Go Home</a>
    </div>
  `;
}

/**
 * Render error page
 */
function renderError(error: any): string {
  return `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    ">
      <h1 style="font-size: 2rem; margin-bottom: 1rem;">500 - Server Error</h1>
      <p style="font-size: 1.2rem; color: #666;">Something went wrong on the server.</p>
      <div style="
        margin-top: 2rem;
        padding: 1rem;
        background-color: #f7f7f7;
        border-radius: 4px;
        width: 80%;
        max-width: 800px;
        overflow-x: auto;
      ">
        <pre style="margin: 0; color: #e00;">${error?.message || 'Unknown error'}</pre>
        ${error?.stack ? `<pre style="margin-top: 1rem; color: #666; font-size: 0.9rem;">${error.stack}</pre>` : ''}
      </div>
      <a href="/" style="
        margin-top: 2rem;
        padding: 0.75rem 1.5rem;
        background-color: #0070f3;
        color: white;
        text-decoration: none;
        border-radius: 4px;
      ">Go Home</a>
    </div>
  `;
}

/**
 * Generate static pages
 */
export async function generateStaticPages(): Promise<void> {
  // Get all pages
  const pagesDir = path.join(process.cwd(), 'pages');
  const pageFiles = await getPageFiles(pagesDir);
  
  // Create output directory
  const outDir = path.join(process.cwd(), '.next', 'static', 'pages');
  await fs.ensureDir(outDir);
  
  // Generate static pages
  for (const pageFile of pageFiles) {
    try {
      // Get page path
      const relativePath = path.relative(pagesDir, pageFile);
      const pagePath = relativePath
        .replace(/\\/g, '/')
        .replace(/\.(js|tsx|jsx|ts)$/, '');
      
      // Skip API routes
      if (pagePath.startsWith('api/')) {
        continue;
      }
      
      // Import page component
      const Page = require(pageFile).default;
      
      // Check if page has getStaticProps
      const getStaticProps: GetStaticProps | undefined = Page.getStaticProps;
      
      // Check if page has getStaticPaths
      const getStaticPaths: GetStaticPaths | undefined = Page.getStaticPaths;
      
      // Generate static paths
      const paths = getStaticPaths
        ? (await getStaticPaths()).paths
        : [{ params: {} }];
      
      // Generate static page for each path
      for (const { params } of paths) {
        // Get page props
        let pageProps = {};
        
        if (getStaticProps) {
          // Call getStaticProps
          const result = await getStaticProps({
            params,
            preview: false,
            previewData: undefined
          });
          
          // Skip if notFound
          if (result.notFound) {
            continue;
          }
          
          // Set props
          pageProps = result.props;
        }
        
        // Render page
        const html = renderToString(
          <HeadProvider>
            <RouterProvider>
              <Page {...pageProps} />
            </RouterProvider>
          </HeadProvider>
        );
        
        // Generate output path
        let outputPath = pagePath;
        
        // Handle dynamic routes
        if (Object.keys(params).length > 0) {
          outputPath = pagePath.replace(
            /\[([^\]]+)\]/g,
            (_, param) => params[param]
          );
        }
        
        // Handle index pages
        if (outputPath === 'index') {
          outputPath = '';
        }
        
        // Create output directory
        const outputDir = path.join(outDir, outputPath);
        await fs.ensureDir(outputDir);
        
        // Write HTML file
        await fs.writeFile(
          path.join(outputDir, 'index.html'),
          html
        );
      }
    } catch (error) {
      console.error(`Error generating static page ${pageFile}:`, error);
    }
  }
}

/**
 * Get all page files
 */
async function getPageFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  const files = await Promise.all(
    entries.map(entry => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? getPageFiles(res) : res;
    })
  );
  
  return files
    .flat()
    .filter(file => /\.(js|tsx|jsx|ts)$/.test(file));
}
