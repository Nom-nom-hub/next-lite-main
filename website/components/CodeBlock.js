import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import styles from '../styles/CodeBlock.module.css';

export default function CodeBlock({ code, language, showLineNumbers = true, fileName = null }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.codeBlockWrapper}>
      {fileName && (
        <div className={styles.fileName}>
          <span>{fileName}</span>
        </div>
      )}
      <div className={styles.codeBlock}>
        <button 
          className={styles.copyButton} 
          onClick={copyToClipboard}
          aria-label="Copy code to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter
          language={language}
          style={atomOneDark}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          customStyle={{
            margin: 0,
            padding: '1rem',
            borderRadius: fileName ? '0 0 0.5rem 0.5rem' : '0.5rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
