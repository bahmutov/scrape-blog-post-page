const got = require('got')
const { convertXML } = require('simple-xml-to-json')

async function getSiteMap() {
  const url = 'https://glebbahmutov.com/blog/sitemap.xml'

  const res = await got(url)
  const list = convertXML(res.body)

  // each entry key is the URL
  // the value is the last modified date as "YYYY-MM-DD" string
  const lastModifiedUrls = {}
  list.urlset.children.forEach((entry) => {
    /*
      entry is like
      { url: { children: [ [Object], [Object] ] } }
      where the first child is
      { loc: { content: 'url'} }
      and the second child is
      { lastmod: { content: '2020-01-27'} }
    */
    const url = entry.url.children[0].loc.content
    const lastModified = entry.url.children[1].lastmod.content
    // the blog post has not been modified recently
    lastModifiedUrls[url] = lastModified
  })
  return lastModifiedUrls
}

module.exports = { getSiteMap }
