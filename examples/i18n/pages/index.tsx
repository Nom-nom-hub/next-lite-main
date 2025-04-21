import React, { useState } from 'react';
import { I18nProvider, useI18n } from '../../example/i18n/I18nProvider';
import { LanguageSwitcher } from '../../example/components/LanguageSwitcher';
import { Button } from '../../example/components/Button';

// Import all locales to register them
import '../../example/i18n/locales/en';
import '../../example/i18n/locales/fr';
import '../../example/i18n/locales/es';

// Main app component wrapped with I18nProvider
export default function I18nExamplePage() {
  return (
    <I18nProvider>
      <I18nExample />
    </I18nProvider>
  );
}

// Example component using i18n
function I18nExample() {
  const { t, locale, formatDate, formatNumber, formatCurrency } = useI18n();
  const [name, setName] = useState('User');
  
  // Current date for formatting examples
  const now = new Date();
  
  // Sample number for formatting examples
  const sampleNumber = 1234567.89;
  
  return (
    <div>
      <header>
        <h1>{t('common.welcome')}</h1>
        <LanguageSwitcher variant="buttons" />
      </header>
      
      <p>{t('common.description')}</p>
      
      <div className="card">
        <h2>{t('greeting', { name })}</h2>
        <div className="form-group">
          <label htmlFor="name">{t('auth.username')}</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.username')}
          />
        </div>
        <Button variant="primary">{t('common.buttons.save')}</Button>
      </div>
      
      <h2>Navigation</h2>
      <nav>
        <ul>
          <li><a href="#">{t('navigation.home')}</a></li>
          <li><a href="#">{t('navigation.about')}</a></li>
          <li><a href="#">{t('navigation.features')}</a></li>
          <li><a href="#">{t('navigation.contact')}</a></li>
        </ul>
      </nav>
      
      <h2>Formatting Examples</h2>
      <div className="grid">
        <div className="card">
          <h3>Date Formatting</h3>
          <p>Current locale: {locale}</p>
          <p>Short date: {formatDate(now, { dateStyle: 'short' })}</p>
          <p>Long date: {formatDate(now, { dateStyle: 'long' })}</p>
          <p>Date and time: {formatDate(now, { dateStyle: 'medium', timeStyle: 'medium' })}</p>
        </div>
        
        <div className="card">
          <h3>Number Formatting</h3>
          <p>Current locale: {locale}</p>
          <p>Number: {formatNumber(sampleNumber)}</p>
          <p>Currency (USD): {formatCurrency(sampleNumber, 'USD')}</p>
          <p>Currency (EUR): {formatCurrency(sampleNumber, 'EUR')}</p>
          <p>Percentage: {formatNumber(0.3456, { style: 'percent' })}</p>
        </div>
      </div>
      
      <h2>Form Example</h2>
      <div className="card">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input id="email" type="email" placeholder={t('auth.email')} />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input id="password" type="password" placeholder={t('auth.password')} />
          </div>
          <Button type="submit">{t('auth.signIn')}</Button>
        </form>
      </div>
    </div>
  );
}
