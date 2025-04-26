import React, { forwardRef, AnchorHTMLAttributes } from 'react';
import { useRouter } from './router';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  as?: string;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  prefetch?: boolean;
  locale?: string | false;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      as,
      replace,
      scroll,
      shallow,
      prefetch = true,
      locale,
      children,
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const isExternal = href.startsWith('http') || href.startsWith('//');
    
    // Prefetch the page if enabled and not external
    React.useEffect(() => {
      if (prefetch && !isExternal && typeof window !== 'undefined') {
        router.prefetch(href);
      }
    }, [prefetch, href, isExternal, router]);
    
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let the browser handle the event for external links, target="_blank", etc.
      if (
        isExternal ||
        props.target === '_blank' ||
        (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)
      ) {
        return;
      }
      
      // Prevent default browser navigation
      e.preventDefault();
      
      // Navigate using the router
      const navigateOptions = {
        scroll,
        shallow,
        locale
      };
      
      if (replace) {
        router.replace(href, as, navigateOptions);
      } else {
        router.push(href, as, navigateOptions);
      }
    };
    
    return (
      <a
        {...props}
        href={isExternal ? href : as || href}
        onClick={handleClick}
        ref={ref}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';

export { Link };
