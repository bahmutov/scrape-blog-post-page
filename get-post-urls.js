const got = require('got')
const cheerio = require('cheerio')
const { URL } = require('url')

async function getBlogPostUrls() {
  const tagPageUrl = 'https://glebbahmutov.com/blog/tags/cypress/'

  const res = await got(tagPageUrl)
  // console.log(res.body)
  const $ = cheerio.load(res.body)

  // find all tags pointing at the blog posts
  // and put the full URL in the array
  const links = []
  $('a.archive-article-title').each(function (k, el) {
    const relativeUrl = $(el).attr('href')
    const fullUrl = new URL(relativeUrl, tagPageUrl)

    // const fullUrl =
    // console.log('%d: %s', k + 1, $(el).text())
    // console.log('%d: %s', k + 1, relativeUrl)
    // console.log('%d: %s', k + 1, fullUrl.href)
    links.push(fullUrl.href)
  })

  console.log('found %d links', links.length)
  return links
}

module.exports = { getBlogPostUrls }
