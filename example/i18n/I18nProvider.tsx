import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultLocale, supportedLocales, useTranslation } from './index';

// Import all locales to register them
import './locales/en';
import './locales/fr';
import './locales/es';

// Define the context type
interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
}

// Create the context with default values
const I18nContext = createContext<I18nContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  t: (key) => key,
  formatDate: (date) => date.toISOString(),
  formatNumber: (number) => number.toString(),
  formatCurrency: (value) => `$${value}`,
});

// Hook to use the i18n context
export const useI18n = () => useContext(I18nContext);

interface I18nProviderProps {
  children: React.ReactNode;
  initialLocale?: string;
}

// Provider component
export function I18nProvider({ children, initialLocale = defaultLocale }: I18nProviderProps) {
  // Use the initial locale if it's supported, otherwise use the default
  const [locale, setLocale] = useState(
    supportedLocales.includes(initialLocale) ? initialLocale : defaultLocale
  );
  
  // Get translation functions for the current locale
  const { t } = useTranslation(locale);
  
  // Format a date according to the current locale
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(locale, options).format(date);
  };
  
  // Format a number according to the current locale
  const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(locale, options).format(number);
  };
  
  // Format a currency value according to the current locale
  const formatCurrency = (value: number, currency = 'USD') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  };
  
  // Update the document language when the locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  
  // Provide the i18n context to children
  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        formatDate,
        formatNumber,
        formatCurrency,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}
