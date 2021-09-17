/// <reference types="cypress" />

const algoliasearch = require('algoliasearch')

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    // little utility task for printing a message to the terminal
    print(x) {
      console.log(x)
      return null
    },

    // upload scraped records to Algolia
    async uploadRecords({ records, slug }) {
      const { APPLICATION_ID, ADMIN_API_KEY, INDEX_NAME } = process.env
      if (!APPLICATION_ID || !ADMIN_API_KEY || !INDEX_NAME) {
        console.log('Algolia app/key not set')
        console.log(
          'Skipping uploading %d records for slug %s',
          records.length,
          slug,
        )
        return null
      }

      if (!slug) {
        throw new Error('Missing slug')
      }

      const client = algoliasearch(APPLICATION_ID, ADMIN_API_KEY)
      const index = client.initIndex(INDEX_NAME)

      console.log('%s: removing existing records for %s', INDEX_NAME, slug)
      await index.deleteBy({
        filters: slug,
      })

      console.log('%s: adding %d records', INDEX_NAME, records.length)
      // each record should have a unique id set
      await index.saveObjects(records, {
        autoGenerateObjectIDIfNotExist: true,
      })

      // cy.task must return something
      return null
    },
  })
}
