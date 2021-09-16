/// <reference types="cypress" />

const { _ } = Cypress

const cleanCharacters = (s) => s.replace(/[\/#]/g, '').trim()

const getAnchor = (el) => {
  if (el.id) {
    return el.id
  }
  if (el.children && el.children.length > 0) {
    return getAnchor(el.children[0])
  }
}

it('loads', () => {
  cy.visit('post.html')

  const selectors = {
    lvl0: 'meta[property="og:title"]',
    lvl1: '.article .article-inner .article-entry h2',
    lvl2: '.article .article-inner .article-entry h3',
    lvl3: '.article .article-inner .article-entry h4',
    lvl4: '.article .article-inner .article-entry .caption',
    text: 'header.article-header h2, .article .article-inner .article-entry p, .article .article-inner .article-entry figure.highlight .comment',
  }

  const cssSelectors = _.values(selectors)

  // as we are going through the document
  // we will update this hierarchy object
  const hierarchy = {
    lvl0: null,
    lvl1: null,
    lvl2: null,
    lvl3: null,
    lvl4: null,
    text: null,
  }
  // we also keep track of the last element with "id" to use
  // as the URL of the record
  let anchor = null

  const records = []

  cy.get(cssSelectors.join(', ')).then(($list) => {
    // if need to debug just a few elements
    // $list = _.slice($list, 0, 5)

    _.each($list, (el, i) => {
      // check which selector the element matched
      const matchedSelectorLevel = _.findKey(selectors, (s) => {
        return el.matches(s)
      })
      if (!matchedSelectorLevel) {
        throw new Error(`Could not match element ${i} to any selector`)
      }

      if (matchedSelectorLevel !== 'text') {
        hierarchy.text = null
      }

      const textContentMaybe = el.innerText || el.content
      if (!textContentMaybe) {
        // maybe it is an element with just an image
        return
      }
      const cleanedText = cleanCharacters(textContentMaybe)
      if (!cleanedText) {
        return
      }

      hierarchy[matchedSelectorLevel] = cleanedText

      const anchorMaybe = getAnchor(el)
      if (anchorMaybe) {
        anchor = anchorMaybe
      }

      // TODO: filter text, filter duplicates, prevent empty records
      const record = _.clone(hierarchy)
      record.anchor = anchor
      records.push(record)

      console.log('%d %s %o', i, matchedSelectorLevel, el)
      console.log('%o', record)
    })
  })
})
