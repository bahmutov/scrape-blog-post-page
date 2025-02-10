const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportHeight: 1400,
  video: false,
  defaultBrowser: 'electron',
  blockHosts: [
    'www.google-analytics.com',
    'disqus.com',
    '*disqus.com',
    '*taboola.com',
    '*carbonads.com',
  ],
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    supportFile: false,
    excludeSpecPattern: 'utils.js',
    baseUrl: 'https://glebbahmutov.com/blog/',
  },
})
