import React from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { supportedLocales } from '../i18n';
import styles from './LanguageSwitcher.module.css';

// Map of locale codes to display names
const localeNames: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  ja: '日本語',
};

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons';
}

/**
 * Language switcher component
 * Allows users to change the application language
 */
export function LanguageSwitcher({ variant = 'dropdown' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();
  
  // Handle language change
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(event.target.value);
  };
  
  // Handle button click
  const handleClick = (newLocale: string) => {
    setLocale(newLocale);
  };
  
  // Render as dropdown
  if (variant === 'dropdown') {
    return (
      <div className={styles.dropdown}>
        <select
          value={locale}
          onChange={handleChange}
          className={styles.select}
          aria-label="Select language"
        >
          {supportedLocales.map((code) => (
            <option key={code} value={code}>
              {localeNames[code] || code}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  // Render as buttons
  return (
    <div className={styles.buttons}>
      {supportedLocales.map((code) => (
        <button
          key={code}
          onClick={() => handleClick(code)}
          className={`${styles.button} ${code === locale ? styles.active : ''}`}
          aria-pressed={code === locale}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
