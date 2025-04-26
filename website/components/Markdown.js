import { useEffect, useState } from 'react';
import { marked } from 'marked';
import CodeBlock from './CodeBlock';
import styles from '../styles/Markdown.module.css';

// Configure marked
marked.setOptions({
  highlight: function(code, lang) {
    return `<pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>`;
  },
  langPrefix: 'language-',
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false
});

export default function Markdown({ content }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    // Parse markdown to HTML
    const parsedHtml = marked(content);
    
    // Process code blocks
    const processedHtml = processCodeBlocks(parsedHtml);
    
    setHtml(processedHtml);
  }, [content]);

  // Process code blocks to use our CodeBlock component
  function processCodeBlocks(html) {
    // This is a simplified approach - in a real implementation, you'd use a proper HTML parser
    const codeBlockRegex = /<pre class="language-([^"]+)"><code class="language-[^"]+">([\s\S]*?)<\/code><\/pre>/g;
    
    return html.replace(codeBlockRegex, (match, language, code) => {
      // Decode HTML entities
      const decodedCode = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      
      // Return placeholder that will be replaced with the CodeBlock component
      return `<div class="code-block" data-language="${language}" data-code="${encodeURIComponent(decodedCode)}"></div>`;
    });
  }

  // Render HTML with special handling for code blocks
  function renderHtml() {
    if (!html) return null;
    
    // Split HTML by code block placeholders
    const parts = html.split(/<div class="code-block" data-language="([^"]+)" data-code="([^"]+)"><\/div>/);
    
    const result = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (i % 3 === 0) {
        // Regular HTML part
        if (parts[i]) {
          result.push(
            <div key={`html-${i}`} dangerouslySetInnerHTML={{ __html: parts[i] }} />
          );
        }
      } else if (i % 3 === 1) {
        // Code block language
        const language = parts[i];
        const encodedCode = parts[i + 1];
        const code = decodeURIComponent(encodedCode);
        
        result.push(
          <CodeBlock 
            key={`code-${i}`} 
            code={code} 
            language={language} 
          />
        );
        
        // Skip the next part (code content) as we've already used it
        i++;
      }
    }
    
    return result;
  }

  return (
    <div className={styles.markdown}>
      {renderHtml()}
    </div>
  );
}
