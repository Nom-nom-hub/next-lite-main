import React from 'react';
import { render } from '@testing-library/react';
import { Head, HeadProvider } from 'next-lite-framework';

describe('Head Component', () => {
  beforeEach(() => {
    // Clear document head before each test
    document.head.innerHTML = '';
  });
  
  it('sets document title', () => {
    render(
      <HeadProvider>
        <Head>
          <title>Test Title</title>
        </Head>
      </HeadProvider>
    );
    
    expect(document.title).toBe('Test Title');
  });
  
  it('adds meta tags', () => {
    render(
      <HeadProvider>
        <Head>
          <meta name="description" content="Test description" />
          <meta property="og:title" content="Test OG Title" />
          <meta httpEquiv="content-type" content="text/html" />
        </Head>
      </HeadProvider>
    );
    
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    const contentTypeMeta = document.querySelector('meta[http-equiv="content-type"]');
    
    expect(descriptionMeta).toBeInTheDocument();
    expect(descriptionMeta).toHaveAttribute('content', 'Test description');
    
    expect(ogTitleMeta).toBeInTheDocument();
    expect(ogTitleMeta).toHaveAttribute('content', 'Test OG Title');
    
    expect(contentTypeMeta).toBeInTheDocument();
    expect(contentTypeMeta).toHaveAttribute('content', 'text/html');
  });
  
  it('adds link tags', () => {
    render(
      <HeadProvider>
        <Head>
          <link rel="stylesheet" href="/styles.css" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </HeadProvider>
    );
    
    const stylesheetLink = document.querySelector('link[rel="stylesheet"]');
    const iconLink = document.querySelector('link[rel="icon"]');
    
    expect(stylesheetLink).toBeInTheDocument();
    expect(stylesheetLink).toHaveAttribute('href', '/styles.css');
    
    expect(iconLink).toBeInTheDocument();
    expect(iconLink).toHaveAttribute('href', '/favicon.ico');
  });
  
  it('adds script tags', () => {
    render(
      <HeadProvider>
        <Head>
          <script src="/script.js" async />
          <script id="inline-script">console.log('test');</script>
        </Head>
      </HeadProvider>
    );
    
    const externalScript = document.querySelector('script[src="/script.js"]');
    const inlineScript = document.querySelector('script#inline-script');
    
    expect(externalScript).toBeInTheDocument();
    expect(externalScript).toHaveAttribute('async', '');
    
    expect(inlineScript).toBeInTheDocument();
    expect(inlineScript.textContent).toBe('console.log(\'test\');');
  });
  
  it('updates existing meta tags', () => {
    // Add initial meta tag
    const initialMeta = document.createElement('meta');
    initialMeta.setAttribute('name', 'description');
    initialMeta.setAttribute('content', 'Initial description');
    document.head.appendChild(initialMeta);
    
    render(
      <HeadProvider>
        <Head>
          <meta name="description" content="Updated description" />
        </Head>
      </HeadProvider>
    );
    
    const metaTags = document.querySelectorAll('meta[name="description"]');
    
    // Should only have one meta tag
    expect(metaTags.length).toBe(1);
    
    // Content should be updated
    expect(metaTags[0]).toHaveAttribute('content', 'Updated description');
  });
  
  it('handles multiple Head components', () => {
    render(
      <HeadProvider>
        <div>
          <Head>
            <title>First Title</title>
            <meta name="description" content="First description" />
          </Head>
          <Head>
            <title>Second Title</title>
            <meta name="keywords" content="test, keywords" />
          </Head>
        </div>
      </HeadProvider>
    );
    
    // Title should be the last one set
    expect(document.title).toBe('Second Title');
    
    // Both meta tags should exist
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    
    expect(descriptionMeta).toBeInTheDocument();
    expect(descriptionMeta).toHaveAttribute('content', 'First description');
    
    expect(keywordsMeta).toBeInTheDocument();
    expect(keywordsMeta).toHaveAttribute('content', 'test, keywords');
  });
});
