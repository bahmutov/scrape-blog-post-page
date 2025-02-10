const algoliasearch = require('algoliasearch')
const { markScraped } = require('was-it-scraped')
const path = require('path')
const fs = require('fs')
const cypress = require('cypress')
const urlsToScrape = require('./need-scraping.json')

console.log('to scrape %d posts', urlsToScrape.length)

async function uploadRecordsToAlgolia(records, slug) {
  if (!Array.isArray(records)) {
    throw new Error('records must be an array')
  }
  if (!slug) {
    throw new Error('slug is required')
  }

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
}

async function scrapeOnePost(url) {
  const outputFolder = 'scraped'
  const slug = url.split('/').filter(Boolean).pop()
  console.log('scraping url %s, slug %s', url, slug)
  const outputRecordsFilename = path.join(
    outputFolder,
    `${slug}-algolia-objects.json`,
  )

  await cypress.run({
    config: {
      baseUrl: url,
    },
    env: {
      slug,
      outputRecordsFilename,
    },
    spec: 'cypress/e2e/spec2.cy.js',
  })

  const records = JSON.parse(fs.readFileSync(outputRecordsFilename))
  await uploadRecordsToAlgolia(records, slug)

  await markScraped(url)
}

async function scrapeUrls(urls) {
  for (let url of urls) {
    await scrapeOnePost(url)
  }
}

scrapeUrls(urlsToScrape).catch((err) => {
  console.error(err)
  process.exit(1)
})
