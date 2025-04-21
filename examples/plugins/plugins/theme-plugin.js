/**
 * Theme Plugin for Next-Lite
 * Adds theme support with dark mode toggle
 */
const { createPlugin } = require('../../../scripts/plugin-system');

// Create the theme plugin
const themePlugin = createPlugin({
  name: 'theme',
  
  // Plugin initialization
  init() {
    console.log('Theme plugin initialized');
  },
  
  // Plugin hooks
  hooks: {
    // Add theme styles and script to HTML
    afterRender: (html) => {
      // Add theme styles to head
      const headStyles = `
        <style id="theme-styles">
          :root {
            --bg-color: #ffffff;
            --text-color: #333333;
            --primary-color: #7928CA;
            --secondary-color: #FF0080;
            --border-color: #eaeaea;
            --card-bg: #f9f9f9;
          }
          
          [data-theme="dark"] {
            --bg-color: #1a1a1a;
            --text-color: #f5f5f5;
            --primary-color: #9d4edd;
            --secondary-color: #ff5e5b;
            --border-color: #333333;
            --card-bg: #2a2a2a;
          }
          
          body {
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
          }
          
          .theme-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            border: none;
            font-size: 1.5rem;
          }
        </style>
      `;
      
      // Add theme toggle button and script to body
      const bodyScript = `
        <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
          🌓
        </button>
        
        <script>
          // Theme toggle functionality
          (function() {
            const themeToggle = document.getElementById('theme-toggle');
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Check for saved theme preference or use OS preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
            
            // Toggle theme
            themeToggle.addEventListener('click', () => {
              const currentTheme = document.documentElement.getAttribute('data-theme');
              const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
              
              document.documentElement.setAttribute('data-theme', newTheme);
              localStorage.setItem('theme', newTheme);
            });
          })();
        </script>
      `;
      
      // Insert styles in head
      html = html.replace('</head>', `${headStyles}</head>`);
      
      // Insert toggle button and script before closing body tag
      html = html.replace('</body>', `${bodyScript}</body>`);
      
      return html;
    },
  },
});

module.exports = themePlugin;
