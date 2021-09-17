const algoliasearch = require('algoliasearch')

const { APPLICATION_ID, ADMIN_API_KEY, INDEX_NAME } = process.env
if (!APPLICATION_ID || !ADMIN_API_KEY || !INDEX_NAME) {
  console.log('Algolia app/key not set')
  return null
}

const client = algoliasearch(APPLICATION_ID, ADMIN_API_KEY)
const index = client.initIndex(INDEX_NAME)
// index
//   // .search({ filtering: { tagFilters: 'skip-cypress-install-on-ci' } })
//   .search({ tagFilters: 'skip-cypress-install-on-ci' })
//   .then(console.log, console.error)

function cleanSlug(slug) {
  // removes extra slashes if any
  return slug.replace(/\//g, '')
}

async function getScrapedTimestamp(slug) {
  slug = cleanSlug(slug)
  let hits = []

  await index.browseObjects({
    query: '',
    // browseParameters: {
    //   tagFilters: 'skip-cypress-install-on-ci',
    // },
    // tagFilters: 'skip-cypress-install-on-ci',
    // tagFilters: 'code-coverage-for-chat-tests',
    tagFilters: slug,
    attributesToRetrieve: ['scrapedTimestamp'],
    batch: (batch) => {
      hits = hits.concat(batch)
    },
  })

  if (!hits.length) {
    console.log('cannot find any records for slug %s', slug)
    return null
  }

  const firstHit = hits[0]
  if (!firstHit.scrapedTimestamp) {
    console.log(
      'cannot find scrapedTimestamp in the first object for slug %s',
      slug,
    )
    return null
  }

  // Unix timestamp in seconds
  return firstHit.scrapedTimestamp
}

module.exports = { getScrapedTimestamp }

// getScrapedTimestamp('code-coverage-for-chat-tests').then(
//   console.log,
//   console.error,
// )
