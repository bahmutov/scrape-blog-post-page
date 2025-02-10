// @ts-check
/// <reference types="cypress" />

it('finds post', { baseUrl: null }, () => {
  cy.visit('post.html')

  function hasAnchor($el) {
    const $anchor = $el.find('[id]')
    return $anchor.length > 0
  }

  function getAnchor($el) {
    const $anchor = $el.find('[id]')
    return $anchor.attr('id')
  }

  let records = []
  let currentRecord = {
    anchor: null,
    text: '',
  }
  records.push(currentRecord)

  // now process all article elements, grouping them by the anchor
  cy.get(
    `header.article-header h2,
    article .article-inner h2,
    .article .article-inner .article-entry p,
    .article .article-inner .article-entry figure.highlight .comment
  `,
  )
    .each(($snippet) => {
      if (hasAnchor($snippet)) {
        const anchor = getAnchor($snippet)
        console.log('anchor element', anchor)
        currentRecord = {
          anchor,
          text: '',
        }
        records.push(currentRecord)
      } else {
        currentRecord.text += '\n' + $snippet.text().replace(/\s+/g, ' ')
      }
    })
    .then(() => {
      // TODO check each record to make sure its size is within the limit
      records.forEach((record) => {
        record.text = record.text.trim()
      })

      records = records.filter((record) => record.text.length > 0)

      console.log('records')
      console.log(records)
    })
})
