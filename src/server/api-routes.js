const fs = require('fs-extra');
const path = require('path');

/**
 * Register built-in API routes
 * @param {Object} app - Express app
 * @param {string} dir - Root directory
 */
function registerBuiltInApiRoutes(app, dir) {
  // API route for translations
  app.get('/api/translations/:locale', (req, res) => {
    const { locale } = req.params;
    
    try {
      const translationsPath = path.join(dir, 'locales', `${locale}.json`);
      
      if (!fs.existsSync(translationsPath)) {
        return res.status(404).json({ error: `Translations for locale '${locale}' not found` });
      }
      
      const translations = fs.readJSONSync(translationsPath);
      res.json(translations);
    } catch (error) {
      console.error(`Error loading translations for ${locale}:`, error);
      res.status(500).json({ error: 'Failed to load translations' });
    }
  });
}

module.exports = {
  registerBuiltInApiRoutes
};