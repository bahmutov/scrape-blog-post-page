// @ts-check
/// <reference types="cypress" />

import {
  hasAnchor,
  getAnchor,
  scrapeTextContent,
  scrapeToAlgoliaRecord,
} from './utils'

const { _ } = Cypress

const cleanCharacters = (s) => s.replace(/[\/#]/g, '').trim()

// const getAnchor = (el) => {
//   if (el.id) {
//     return el.id
//   }
//   if (el.children && el.children.length > 0) {
//     return getAnchor(el.children[0])
//   }
// }

it('scrapes the blog post 2', () => {
  const outputFolder = 'scraped'

  cy.visit('/react-app-actions/')

  cy.location('href').then((baseUrl) => {
    // take the last part of the url which is the post name
    const slug =
      Cypress.env('slug') || _.last(_.filter(_.split(baseUrl, '/'), Boolean))
    cy.task('print', `scraping ${baseUrl} with slug ${slug}`)

    const scrapedTimestamp = +new Date()
    const _tags = [slug]

    cy.get('meta[property="og:title"]')
      .invoke('attr', 'content')
      .then((lvl0) => {
        const headingRecords = []
        // get the title record
        const titleRecord = scrapeToAlgoliaRecord({
          url: baseUrl,
          _tags,
          lvl0,
        })
        titleRecord.scrapedTimestamp = scrapedTimestamp
        headingRecords.push(titleRecord)

        // get the secondary headings
        cy.get('.article .article-inner .article-entry h2').each(($h2) => {
          const anchor = hasAnchor($h2) ? getAnchor($h2) : null
          const record = scrapeToAlgoliaRecord({
            anchor,
            url: anchor ? `${baseUrl}#${anchor}` : baseUrl,
            _tags,
            lvl0,
            lvl1: cleanCharacters($h2.text()),
          })
          record.scrapedTimestamp = scrapedTimestamp
          headingRecords.push(record)
        })

        scrapeTextContent().then((textRecords) => {
          const records = textRecords.map((tr) => {
            const record = scrapeToAlgoliaRecord({
              anchor: tr.anchor,
              text: tr.text,
              url: tr.anchor ? `${baseUrl}#${tr.anchor}` : baseUrl,
              _tags,
              lvl0,
            })
            record.scrapedTimestamp = scrapedTimestamp

            return record
          })

          const allRecords = [...headingRecords, ...records]

          const filename =
            Cypress.env('outputRecordsFilename') ||
            `${outputFolder}/${slug}-algolia-objects.json`
          cy.writeFile(filename, allRecords)
          cy.task(
            'print',
            `saved ${filename} with ${allRecords.length} records`,
          )

          // let's upload the records to Algolia
          // see the task registered in the cypress/plugins/index.js file
          cy.task('uploadRecords', { records: allRecords, slug })
        })
      })
  })
})
