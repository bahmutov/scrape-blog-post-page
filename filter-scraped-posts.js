const fs = require('fs')
const allPosts = require('./blog-post-urls.json').slice(0, 3)
console.log('checking %d posts if they are scraped', allPosts.length)

const { wasScraped } = require('was-it-scraped')

async function checkScrapeStatus(urls) {
  const results = []
  for (let url of urls) {
    const scraped = await wasScraped(url)
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
