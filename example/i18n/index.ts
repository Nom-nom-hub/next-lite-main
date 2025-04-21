/**
 * Simple internationalization (i18n) implementation for Next-Lite
 */

// Define the supported locales
export const supportedLocales = ['en', 'fr', 'es', 'de', 'ja'];

// Default locale
export const defaultLocale = 'en';

// Type for translation dictionaries
export type TranslationDictionary = Record<string, string | Record<string, string>>;

// Store for translations
const translations: Record<string, TranslationDictionary> = {};

/**
 * Register translations for a locale
 * @param locale - The locale code (e.g., 'en', 'fr')
 * @param dictionary - The translation dictionary
 */
export function registerTranslations(locale: string, dictionary: TranslationDictionary): void {
  translations[locale] = dictionary;
}

/**
 * Get a translation by key
 * @param key - The translation key (supports dot notation for nested keys)
 * @param locale - The locale to use (defaults to defaultLocale)
 * @param params - Optional parameters to interpolate into the translation
 * @returns The translated string or the key if translation is not found
 */
export function t(key: string, locale = defaultLocale, params?: Record<string, string>): string {
  // Get the dictionary for the requested locale, fallback to default
  const dictionary = translations[locale] || translations[defaultLocale] || {};
  
  // Handle nested keys with dot notation (e.g., 'common.buttons.submit')
  const keys = key.split('.');
  let result: any = dictionary;
  
  // Navigate through the nested keys
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      // Key not found, return the original key
      return key;
    }
  }
  
  // If the result is not a string, return the key
  if (typeof result !== 'string') {
    return key;
  }
  
  // Interpolate parameters if provided
  if (params) {
    return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
      return str.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
    }, result);
  }
  
  return result;
}

/**
 * React hook for using translations in components
 * @param locale - The locale to use
 * @returns An object with the t function bound to the locale
 */
export function useTranslation(locale = defaultLocale) {
  return {
    t: (key: string, params?: Record<string, string>) => t(key, locale, params),
    locale,
  };
}

/**
 * Format a date according to the locale
 * @param date - The date to format
 * @param locale - The locale to use for formatting
 * @param options - Intl.DateTimeFormat options
 * @returns The formatted date string
 */
export function formatDate(
  date: Date,
  locale = defaultLocale,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Format a number according to the locale
 * @param number - The number to format
 * @param locale - The locale to use for formatting
 * @param options - Intl.NumberFormat options
 * @returns The formatted number string
 */
export function formatNumber(
  number: number,
  locale = defaultLocale,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * Format a currency value according to the locale
 * @param value - The value to format
 * @param currency - The currency code (e.g., 'USD', 'EUR')
 * @param locale - The locale to use for formatting
 * @returns The formatted currency string
 */
export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = defaultLocale
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}
