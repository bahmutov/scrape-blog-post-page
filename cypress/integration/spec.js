// @ts-check
/// <reference types="cypress" />

import { scrapeToAlgoliaRecord } from './utils'

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

it('scrapes the blog post', () => {
  const outputFolder = 'scraped'

  // cy.visit('post.html')
  // cy.visit('/code-coverage-for-chat-tests/')
  const post = Cypress.env('post') || '/code-coverage-for-chat-tests/'
  cy.visit(post)

  cy.location('href').then((baseUrl) => {
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
    // const baseUrl = 'https://glebbahmutov.com/blog/code-coverage-for-chat-tests/'
    // take the last part of the url which is the post name
    const slug = _.last(_.filter(_.split(baseUrl, '/'), Boolean))
    const _tags = [slug]
    let url = baseUrl

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

        // @ts-ignore
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
          url = `${baseUrl}#${anchor}`
        }

        // TODO: filter text, filter duplicates, prevent empty records
        const record = _.clone(hierarchy)
        record.anchor = anchor
        record.url = url
        record._tags = _tags

        console.log('%d %s %o', i, matchedSelectorLevel, el)
        console.log('%o', record)

        const algoliaRecord = scrapeToAlgoliaRecord(record)
        console.log(algoliaRecord)
        records.push(algoliaRecord)
      })

      cy.writeFile(`${outputFolder}/${slug}-algolia-objects.json`, records)

      // let's upload the records to Algolia
      // see the task registered in the cypress/plugins/index.js file
      cy.task('uploadRecords', { records, slug })
    })
  })
})
