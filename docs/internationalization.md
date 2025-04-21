# Internationalization (i18n) in Next-Lite

Next-Lite includes built-in support for internationalization, allowing you to create multilingual applications with ease.

## Getting Started

Next-Lite's i18n system is based on a simple key-value translation approach with support for nested keys and interpolation.

### Basic Setup

1. Import the necessary components:

```tsx
import { I18nProvider, useI18n } from 'next-lite-framework/i18n';
```

2. Wrap your application with the `I18nProvider`:

```tsx
function MyApp({ Component, pageProps }) {
  return (
    <I18nProvider>
      <Component {...pageProps} />
    </I18nProvider>
  );
}
```

3. Use translations in your components:

```tsx
function HomePage() {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
}
```

## Translation Files

Create translation files for each supported language:

```tsx
// i18n/locales/en.ts
import { registerTranslations } from 'next-lite-framework/i18n';

const translations = {
  common: {
    welcome: 'Welcome to Next-Lite',
    description: 'A lightweight alternative to Next.js',
    buttons: {
      submit: 'Submit',
      cancel: 'Cancel',
    },
  },
  // More translations...
};

// Register English translations
registerTranslations('en', translations);

export default translations;
```

```tsx
// i18n/locales/fr.ts
import { registerTranslations } from 'next-lite-framework/i18n';

const translations = {
  common: {
    welcome: 'Bienvenue à Next-Lite',
    description: 'Une alternative légère à Next.js',
    buttons: {
      submit: 'Soumettre',
      cancel: 'Annuler',
    },
  },
  // More translations...
};

// Register French translations
registerTranslations('fr', translations);

export default translations;
```

## Using Translations

### Basic Translation

```tsx
const { t } = useI18n();

// Simple translation
<p>{t('common.welcome')}</p>

// Nested translation
<button>{t('common.buttons.submit')}</button>
```

### Interpolation

You can include variables in your translations:

```tsx
// In your translation file
{
  greeting: 'Hello, {{name}}!',
}

// In your component
const { t } = useI18n();
const name = 'John';

<p>{t('greeting', { name })}</p> // Renders: Hello, John!
```

## Switching Languages

Use the `setLocale` function to change the current language:

```tsx
function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  
  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
    </select>
  );
}
```

## Formatting

### Date Formatting

```tsx
const { formatDate } = useI18n();
const now = new Date();

// Format date according to the current locale
<p>{formatDate(now, { dateStyle: 'full' })}</p>
```

### Number Formatting

```tsx
const { formatNumber } = useI18n();

// Format number according to the current locale
<p>{formatNumber(1234567.89)}</p>

// Format as percentage
<p>{formatNumber(0.3456, { style: 'percent' })}</p>
```

### Currency Formatting

```tsx
const { formatCurrency } = useI18n();

// Format currency according to the current locale
<p>{formatCurrency(1234.56, 'USD')}</p>
<p>{formatCurrency(1234.56, 'EUR')}</p>
```

## Server-Side Rendering

When using SSR, you can pass the initial locale from the server:

```tsx
// pages/index.tsx
export default function HomePage({ locale }) {
  return (
    <I18nProvider initialLocale={locale}>
      <Home />
    </I18nProvider>
  );
}

export async function getServerSideProps(context) {
  // Get locale from request headers or cookies
  const locale = context.req.headers['accept-language']?.split(',')[0].split('-')[0] || 'en';
  
  return {
    props: {
      locale,
    },
  };
}
```

## URL-Based Localization

For URL-based localization (e.g., `/en/about`, `/fr/about`), you can extract the locale from the URL:

```tsx
// pages/[locale]/[...slug].tsx
export default function LocalizedPage({ locale, slug }) {
  return (
    <I18nProvider initialLocale={locale}>
      <DynamicPage slug={slug} />
    </I18nProvider>
  );
}

export async function getServerSideProps(context) {
  const { locale, slug } = context.params;
  
  return {
    props: {
      locale,
      slug,
    },
  };
}
```

## Best Practices

1. **Use namespaces** to organize translations (e.g., `common.`, `auth.`, `errors.`)
2. **Keep translation keys simple** and descriptive
3. **Use interpolation** for dynamic content
4. **Provide fallbacks** for missing translations
5. **Separate translations** into multiple files for large applications
6. **Use context** for specialized translations (e.g., technical terms)
7. **Test your translations** to ensure they fit in the UI
