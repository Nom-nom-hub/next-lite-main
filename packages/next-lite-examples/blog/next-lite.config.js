module.exports = {
  server: {
    port: 3000,
    host: 'localhost'
  },
  build: {
    target: ['es2015'],
    minify: true,
    sourcemap: true,
    outDir: '.next'
  },
  experimental: {
    ssr: true
  },
  env: {
    API_URL: 'https://jsonplaceholder.typicode.com'
  }
};
