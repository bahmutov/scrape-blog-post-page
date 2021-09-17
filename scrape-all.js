const { getScrapedTimestamp } = require('./check-date')

const posts = ['/test-plain-or-markdown-file/', '/skip-cypress-install-on-ci/']

const { APPLICATION_ID, ADMIN_API_KEY, INDEX_NAME } = process.env
if (!APPLICATION_ID || !ADMIN_API_KEY || !INDEX_NAME) {
  throw new Error('Algolia app/key/index not set')
}

const cypress = require('cypress')

async function scrapePresentations(urls) {
  if (!urls.length) {
    return
  }

  const post = urls.shift()
  console.log(`Scraping %s, %d left`, post, urls.length)
  const lastScraped = await getScrapedTimestamp(post)
  if (lastScraped) {
    const lastScrapedDate = new Date(lastScraped)
    console.log('blog %s was last scraped at %s', post, lastScrapedDate)
  }

  await cypress.run({
    env: {
      post,
    },
    spec: 'cypress/integration/spec.js',
  })

  // scrape the rest of the presentations
  await scrapePresentations(urls)
}
scrapePresentations(posts).then(() => console.log('all done'))
