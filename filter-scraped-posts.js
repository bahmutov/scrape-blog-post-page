const fs = require('fs')
// an object with [url] => [modified] where modified is "YYYY-MM-DD"
const allPosts = require('./blog-post-urls.json')
console.log(
  'checking %d posts if they are scraped',
  Object.keys(allPosts).length,
)

const { wasScraped, wasScrapedAfter } = require('was-it-scraped')

async function checkScrapeStatus(urlsModified) {
  const urls = Object.keys(urlsModified)
  const results = []
  for (let url of urls) {
    const modified = new Date(urlsModified[url])
    const scraped = await wasScrapedAfter(url, modified)
    if (!scraped) {
      results.push(url)
    }
  }

  return results
}

checkScrapeStatus(allPosts).then((list) => {
  const filename = 'need-scraping.json'
  fs.writeFileSync(filename, JSON.stringify(list, null, 2) + '\n')
  console.log('saved %d links to be scraped into %s', list.length, filename)
})
