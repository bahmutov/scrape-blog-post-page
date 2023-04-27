// @ts-check
const fs = require('fs')
const { getBlogPostUrls } = require('./get-post-urls')
const { getSiteMap } = require('./get-sitemap')

async function getModifiedPostUrls(saveFilename) {
  const [modified, posts] = await Promise.all([getSiteMap(), getBlogPostUrls()])
  const cypressPostsWithModified = {}
  posts.forEach((url) => {
    if (!modified[url]) {
      console.error('missing modified date for %s', url)
    } else {
      cypressPostsWithModified[url] = modified[url]
    }
  })

  if (saveFilename) {
    const text = JSON.stringify(cypressPostsWithModified, null, 2) + '\n'
    fs.writeFileSync(saveFilename, text)
    console.log(
      'saved %d links to %s',
      Object.keys(cypressPostsWithModified).length,
      saveFilename,
    )
  }

  return cypressPostsWithModified
}

module.exports = { getModifiedPostUrls }
