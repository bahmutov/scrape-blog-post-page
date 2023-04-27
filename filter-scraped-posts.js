const fs = require('fs')
// a list of post information objects where modified is "YYYY-MM-DD"
const allPosts = require('./blog-post-urls.json')
console.log('checking %d posts if they are scraped', allPosts.length)

const { wasScraped, wasScrapedAfter } = require('was-it-scraped')

async function checkScrapeStatus(posts) {
  const results = []
  for (const post of posts) {
    const modified = new Date(post.modified)
    const scraped = await wasScrapedAfter(post.url, modified)
    if (!scraped) {
      results.push(post.url)
    }
  }

  return results
}

checkScrapeStatus(allPosts).then((list) => {
  const filename = 'need-scraping.json'
  fs.writeFileSync(filename, JSON.stringify(list, null, 2) + '\n')
  console.log('saved %d links to be scraped into %s', list.length, filename)
})
