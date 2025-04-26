export default {
  logo: <span style={{ fontWeight: 'bold' }}>Next-Lite</span>,
  project: {
    link: 'https://github.com/next-lite/next-lite',
  },
  docsRepositoryBase: 'https://github.com/next-lite/next-lite/tree/main/packages/next-lite-docs',
  footer: {
    text: `© ${new Date().getFullYear()} Next-Lite Framework. MIT License.`,
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Next-Lite: A lightweight alternative to Next.js" />
      <meta name="og:title" content="Next-Lite Documentation" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Next-Lite'
    }
  },
  navigation: {
    prev: true,
    next: true
  },
  darkMode: true,
  nextThemes: {
    defaultTheme: 'system'
  },
  sidebar: {
    defaultMenuCollapseLevel: 1
  }
};
