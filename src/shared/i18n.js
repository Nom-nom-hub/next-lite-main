'use strict';

const React = require('react');

// Create a context for i18n
const I18nContext = React.createContext({
  locale: 'en',
  defaultLocale: 'en',
  locales: ['en'],
  translations: {},
  t: (key) => key
});

/**
 * I18n provider component
 * @param {Object} props - Component props
 * @param {string} props.locale - Current locale
 * @param {string} props.defaultLocale - Default locale
 * @param {Array<string>} props.locales - Supported locales
 * @param {Object} props.translations - Translations object
 * @param {React.ReactNode} props.children - Children components
 */
function I18nProvider({
  locale,
  defaultLocale,
  locales,
  translations,
  children
}) {
  // Create translation function
  const t = React.useCallback((key, params = {}) => {
    // Get the translation for the current locale
    const translation = translations[locale] || {};
    
    // Get the translation for the key
    let text = translation[key] || translations[defaultLocale]?.[key] || key;
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{{${param}}}`, value);
      });
    }
    
    return text;
  }, [locale, defaultLocale, translations]);
  
  // Create context value
  const value = React.useMemo(() => ({
    locale,
    defaultLocale,
    locales,
    translations,
    t
  }), [locale, defaultLocale, locales, translations, t]);
  
  return React.createElement(
    I18nContext.Provider,
    { value },
    children
  );
}

/**
 * Hook to use i18n
 * @returns {Object} - I18n context
 */
function useI18n() {
  return React.useContext(I18nContext);
}

/**
 * Get the locale from the request
 * @param {Object} req - HTTP request object
 * @param {Object} i18n - I18n configuration
 * @returns {string} - Locale
 */
function getLocaleFromRequest(req, i18n) {
  // Get the locale from the URL
  const { pathname } = req.url ? new URL(req.url, 'http://localhost') : { pathname: '/' };
  
  // Check if the pathname starts with a locale
  const pathnameLocale = i18n.locales.find(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameLocale) {
    return pathnameLocale;
  }
  
  // Check the Accept-Language header
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    const acceptedLocales = acceptLanguage.split(',')
      .map(lang => lang.split(';')[0].trim())
      .filter(lang => i18n.locales.includes(lang));
    
    if (acceptedLocales.length > 0) {
      return acceptedLocales[0];
    }
  }
  
  // Fallback to default locale
  return i18n.defaultLocale;
}

/**
 * Get the localized path
 * @param {string} path - Original path
 * @param {string} locale - Locale
 * @returns {string} - Localized path
 */
function getLocalizedPath(path, locale) {
  // If the path already starts with the locale, return it
  if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
    return path;
  }
  
  // Add the locale to the path
  return `/${locale}${path === '/' ? '' : path}`;
}

module.exports = {
  I18nProvider,
  useI18n,
  getLocaleFromRequest,
  getLocalizedPath
};
