/**
 * Internationalization (i18n) support for Next-Lite
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * Default i18n configuration
 */
const defaultConfig = {
  locales: ['en'],
  defaultLocale: 'en',
  localeDetection: true,
  domains: [],
  pages: {}
};

/**
 * Load i18n configuration from next-lite.config.js
 * @param {string} dir - Root directory
 * @returns {Object} - i18n configuration
 */
function loadI18nConfig(dir) {
  try {
    const configPath = path.join(dir, 'next-lite.config.js');
    if (!fs.existsSync(configPath)) {
      return defaultConfig;
    }
    
    const config = require(configPath);
    return config.i18n || defaultConfig;
  } catch (error) {
    console.warn('Failed to load i18n config:', error);
    return defaultConfig;
  }
}

/**
 * Load translations for a specific locale
 * @param {string} dir - Root directory
 * @param {string} locale - Locale to load
 * @returns {Object} - Translations
 */
function loadTranslations(dir, locale) {
  try {
    const translationsPath = path.join(dir, 'locales', `${locale}.json`);
    if (!fs.existsSync(translationsPath)) {
      return {};
    }
    
    return fs.readJSONSync(translationsPath);
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}:`, error);
    return {};
  }
}

/**
 * Create i18n middleware
 * @param {string} dir - Root directory
 * @returns {Function} - Express middleware
 */
function createI18nMiddleware(dir) {
  const config = loadI18nConfig(dir);
  const translations = {};
  
  // Load translations for all locales
  config.locales.forEach(locale => {
    translations[locale] = loadTranslations(dir, locale);
  });
  
  return function i18nMiddleware(req, res, next) {
    // Detect locale from request
    let locale = config.defaultLocale;
    
    if (config.localeDetection) {
      // Check for locale in path
      const pathLocale = req.path.split('/')[1];
      if (config.locales.includes(pathLocale)) {
        locale = pathLocale;
        // Rewrite URL without locale prefix for internal routing
        req.url = req.url.replace(new RegExp(`^/${locale}`), '') || '/';
      } else {
        // Check Accept-Language header
        const acceptLanguage = req.headers['accept-language'];
        if (acceptLanguage) {
          const preferredLocales = acceptLanguage
            .split(',')
            .map(lang => lang.split(';')[0].trim());
          
          for (const preferredLocale of preferredLocales) {
            if (config.locales.includes(preferredLocale)) {
              locale = preferredLocale;
              break;
            }
          }
        }
      }
    }
    
    // Attach i18n object to request
    req.i18n = {
      locale,
      defaultLocale: config.defaultLocale,
      locales: config.locales,
      t: (key, params = {}) => {
        const translation = translations[locale]?.[key] || key;
        
        // Replace parameters in translation
        return translation.replace(/\{(\w+)\}/g, (_, param) => {
          return params[param] !== undefined ? params[param] : `{${param}}`;
        });
      }
    };
    
    // Attach i18n object to res.locals for use in templates
    res.locals.i18n = req.i18n;
    
    next();
  };
}

/**
 * Client-side i18n hook
 * @param {Object} initialTranslations - Initial translations
 * @param {string} initialLocale - Initial locale
 * @returns {Object} - i18n object
 */
function useTranslation(initialTranslations = {}, initialLocale = 'en') {
  const [translations, setTranslations] = React.useState(initialTranslations);
  const [locale, setLocale] = React.useState(initialLocale);
  
  // Translation function
  const t = React.useCallback((key, params = {}) => {
    const translation = translations[key] || key;
    
    // Replace parameters in translation
    return translation.replace(/\{(\w+)\}/g, (_, param) => {
      return params[param] !== undefined ? params[param] : `{${param}}`;
    });
  }, [translations]);
  
  // Change locale function
  const changeLocale = React.useCallback(async (newLocale) => {
    try {
      // Fetch translations for new locale
      const response = await fetch(`/api/translations/${newLocale}`);
      const newTranslations = await response.json();
      
      setTranslations(newTranslations);
      setLocale(newLocale);
      
      // Update HTML lang attribute
      document.documentElement.lang = newLocale;
      
      return true;
    } catch (error) {
      console.error('Failed to change locale:', error);
      return false;
    }
  }, []);
  
  return {
    t,
    locale,
    changeLocale
  };
}

module.exports = {
  createI18nMiddleware,
  useTranslation,
  loadI18nConfig
};