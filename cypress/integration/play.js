/// <reference types="cypress" />

it('finds post', { baseUrl: null }, () => {
  cy.visit('post.html')

  const sectionAnchors = {}
  const h2Elements = []
  let currentH2 = null

  cy.get('article .article-inner h2:has([id])')
    .each(($h2) => {
      const $anchor = $h2.find('[id]')
      const anchor = $anchor.attr('id')
      const title = $anchor.text()
      console.log(anchor, title)

      const node = $h2[0]
      sectionAnchors[anchor] = {
        anchor,
        title,
        node,
        nodes: [],
      }
      h2Elements.push(node)
    })
    .then(() => {
      console.log(sectionAnchors)
    })
  // now process all article elements, grouping them by the anchor
  cy.get(
    `header.article-header h2,
    article .article-inner h2,
    .article .article-inner .article-entry p,
    .article .article-inner .article-entry figure.highlight .comment
  `,
  ).each(($snippet) => {
    console.log($snippet[0])
    if (h2Elements.includes[$snippet[0]]) {
      console.log('reached', $snippet.text())
      currentH2 = $snippet[0]
    }
  })
})
