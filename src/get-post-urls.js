const got = require('got')
const fs = require('fs')
const cheerio = require('cheerio')
const { URL } = require('url')

const cypressBlogPostsUrl = 'https://glebbahmutov.com/blog/tags/cypress/'

async function getBlogPostUrls() {
  const res = await got(cypressBlogPostsUrl)
  // console.log(res.body)
  const $ = cheerio.load(res.body)

  // find all tags pointing at the blog posts
  // and put the full URL in the array
  const links = []
  $('article.archive-type-post').each(function (k, article) {
    const titleAnchor = $(article).find('a.archive-article-title')
    const title = $(titleAnchor).text().trim()
    const subtitle = $(article).find('h2.archive-article-title').text().trim()
    // console.log(title)
    const relativeUrl = $(titleAnchor).attr('href')
    const fullUrl = new URL(relativeUrl, cypressBlogPostsUrl)

    // const fullUrl =
    // console.log('%d: %s', k + 1, $(el).text())
    // console.log('%d: %s', k + 1, relativeUrl)
    // console.log('%d: %s', k + 1, fullUrl.href)
    links.push({
      url: fullUrl.href,
      title,
      subtitle,
    })
  })

  console.log('found %d links', links.length)
  return links
}

module.exports = { getBlogPostUrls, cypressBlogPostsUrl }

if (!module.parent) {
  getBlogPostUrls()
    .then((links) => {
      const filename = 'blog-post-urls.json'
      fs.writeFileSync(filename, JSON.stringify(links, null, 2) + '\n')
      console.log('saved %d links to %s', links.length, filename)
    })
    .catch((err) => {
      console.error(err)
    })
}
