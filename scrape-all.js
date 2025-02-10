const { getScrapedTimestamp } = require('./check-date')
const { getSiteMap } = require('./get-sitemap')
const { getBlogPostUrls } = require('./get-post-urls')

const { APPLICATION_ID, ADMIN_API_KEY, INDEX_NAME } = process.env
if (!APPLICATION_ID || !ADMIN_API_KEY || !INDEX_NAME) {
  throw new Error('Algolia app/key/index not set')
}

const baseUrl = 'https://glebbahmutov.com/blog'
const cypress = require('cypress')

Promise.all([getSiteMap(), getBlogPostUrls()])
  .then(([modified, posts]) => {
    // modified is an object, key is the full URL
    // and the value is a date string "YYYY-MM-DD"
    // console.log(modified)

    async function scrapePresentations(urls) {
      if (!urls.length) {
        return
      }

      const postUrl = urls.shift()
      console.log(`Scraping %s, %d left`, postUrl, urls.length)
      const parts = postUrl.split('/').filter(Boolean)
      const slug = parts[parts.length - 1]
      console.log('slug "%s"', slug)
      const lastScraped = await getScrapedTimestamp(slug)
      if (lastScraped) {
        const lastScrapedDate = new Date(lastScraped)
        console.log('blog %s was last scraped at %s', postUrl, lastScrapedDate)

        // const postUrl = `${baseUrl}${post}`
        const lastModified = modified[postUrl]
        if (lastModified) {
          console.log('post %s was last modified at %s', postUrl, lastModified)
          const lastModifiedDate = +new Date(lastModified)
          if (lastModifiedDate < lastScraped) {
            // no need to scrape, the blog post was scraped
            // after the last time it was modified
            console.log('SKIPPING SCRAPING')
            await scrapePresentations(urls)
            return
          }
        }
      }

      await cypress.run({
        config: {
          baseUrl: postUrl,
        },
        spec: 'cypress/e2e/spec2.cy.js',
      })

      // scrape the rest of the presentations
      await scrapePresentations(urls)
    }

    return scrapePresentations(posts)
  })
  .then(() => console.log('all done'))
