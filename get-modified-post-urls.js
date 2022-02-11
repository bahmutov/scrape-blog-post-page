// @ts-check
const fs = require('fs')
const { getBlogPostUrls } = require('./get-post-urls')
const { getSiteMap } = require('./get-sitemap')

Promise.all([getSiteMap(), getBlogPostUrls()]).then(([modified, posts]) => {
  const cypressPostsWithModified = {}
  posts.forEach((url) => {
    if (!modified[url]) {
      console.error('missing modified date for %s', url)
    } else {
      cypressPostsWithModified[url] = modified[url]
    }
  })

  const filename = 'blog-post-urls.json'
  fs.writeFileSync(
    filename,
    JSON.stringify(cypressPostsWithModified, null, 2) + '\n',
  )
  console.log(
    'saved %d links to %s',
    Object.keys(cypressPostsWithModified).length,
    filename,
  )
})
