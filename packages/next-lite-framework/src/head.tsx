import React, { useEffect, createContext, useContext } from 'react';

// Head context
interface HeadContextType {
  title: string;
  meta: React.ReactElement[];
  links: React.ReactElement[];
  scripts: React.ReactElement[];
  updateHead: (elements: React.ReactNode) => void;
}

const HeadContext = createContext<HeadContextType>({
  title: '',
  meta: [],
  links: [],
  scripts: [],
  updateHead: () => {}
});

// Head provider
export function HeadProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = React.useState<string>('');
  const [meta, setMeta] = React.useState<React.ReactElement[]>([]);
  const [links, setLinks] = React.useState<React.ReactElement[]>([]);
  const [scripts, setScripts] = React.useState<React.ReactElement[]>([]);
  
  // Update document head when state changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Update title
      if (title) {
        document.title = title;
      }
      
      // Update meta tags
      meta.forEach(metaElement => {
        const { name, property, content, httpEquiv } = metaElement.props;
        
        // Find existing meta tag to update or create a new one
        let existingMeta: HTMLMetaElement | null = null;
        
        if (name) {
          existingMeta = document.querySelector(`meta[name="${name}"]`);
        } else if (property) {
          existingMeta = document.querySelector(`meta[property="${property}"]`);
        } else if (httpEquiv) {
          existingMeta = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
        }
        
        if (existingMeta) {
          // Update existing meta tag
          if (content) existingMeta.setAttribute('content', content);
        } else {
          // Create new meta tag
          const newMeta = document.createElement('meta');
          if (name) newMeta.setAttribute('name', name);
          if (property) newMeta.setAttribute('property', property);
          if (httpEquiv) newMeta.setAttribute('http-equiv', httpEquiv);
          if (content) newMeta.setAttribute('content', content);
          document.head.appendChild(newMeta);
        }
      });
      
      // Update link tags
      links.forEach(linkElement => {
        const { rel, href, as, type } = linkElement.props;
        
        // Find existing link tag to update or create a new one
        let existingLink: HTMLLinkElement | null = null;
        
        if (rel && href) {
          existingLink = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
        }
        
        if (!existingLink) {
          // Create new link tag
          const newLink = document.createElement('link');
          if (rel) newLink.setAttribute('rel', rel);
          if (href) newLink.setAttribute('href', href);
          if (as) newLink.setAttribute('as', as);
          if (type) newLink.setAttribute('type', type);
          document.head.appendChild(newLink);
        }
      });
      
      // Update script tags
      scripts.forEach(scriptElement => {
        const { src, type, async, defer, id } = scriptElement.props;
        
        // Find existing script tag to update or create a new one
        let existingScript: HTMLScriptElement | null = null;
        
        if (id) {
          existingScript = document.querySelector(`script#${id}`);
        } else if (src) {
          existingScript = document.querySelector(`script[src="${src}"]`);
        }
        
        if (!existingScript) {
          // Create new script tag
          const newScript = document.createElement('script');
          if (src) newScript.setAttribute('src', src);
          if (type) newScript.setAttribute('type', type);
          if (async) newScript.setAttribute('async', '');
          if (defer) newScript.setAttribute('defer', '');
          if (id) newScript.setAttribute('id', id);
          
          // Add inline script content if provided
          if (scriptElement.props.children) {
            newScript.textContent = scriptElement.props.children;
          }
          
          document.head.appendChild(newScript);
        }
      });
    }
  }, [title, meta, links, scripts]);
  
  // Update head elements
  const updateHead = (elements: React.ReactNode) => {
    // Process React elements
    React.Children.forEach(elements, (child) => {
      if (!React.isValidElement(child)) return;
      
      const { type, props } = child;
      
      if (type === 'title') {
        setTitle(props.children);
      } else if (type === 'meta') {
        setMeta(prevMeta => [...prevMeta, child]);
      } else if (type === 'link') {
        setLinks(prevLinks => [...prevLinks, child]);
      } else if (type === 'script') {
        setScripts(prevScripts => [...prevScripts, child]);
      }
    });
  };
  
  return (
    <HeadContext.Provider
      value={{
        title,
        meta,
        links,
        scripts,
        updateHead
      }}
    >
      {children}
    </HeadContext.Provider>
  );
}

// Head component
export function Head({ children }: { children: React.ReactNode }) {
  const { updateHead } = useContext(HeadContext);
  
  useEffect(() => {
    updateHead(children);
  }, [children, updateHead]);
  
  return null;
}
