export function hasAnchor($el) {
  const $anchor = $el.find('[id]')
  return $anchor.length > 0
}

export function getAnchor($el) {
  const $anchor = $el.find('[id]')
  return $anchor.attr('id')
}

export const scrapeTextContent = () => {
  let records = []
  let currentRecord = {
    anchor: null,
    text: '',
  }
  records.push(currentRecord)

  // now process all article elements, grouping them by the anchor
  return cy
    .get(
      `
        header.article-header h2,
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
        record.size = Buffer.byteLength(record.text, 'utf8')
      })

      records = records.filter((record) => record.text.length > 0)

      // console.log('records')
      // console.log(records)
      return records
    })
}

export const scrapeToAlgoliaRecord = (record) => {
  const algoliaRecord = {
    anchor: record.anchor,
    content: record.text || null,
    url: record.url || null,
    _tags: record._tags || null,
  }

  algoliaRecord.hierarchy = {
    lvl0: record.lvl0,
    lvl1: record.lvl1,
    lvl2: record.lvl2,
    lvl3: record.lvl3,
    lvl4: record.lvl4,
  }

  if (record.text) {
    algoliaRecord.type = 'content'
  } else {
    if (record.lvl4) {
      algoliaRecord.type = 'lvl4'
    } else if (record.lvl3) {
      algoliaRecord.type = 'lvl3'
    } else if (record.lvl2) {
      algoliaRecord.type = 'lvl2'
    } else if (record.lvl1) {
      algoliaRecord.type = 'lvl1'
    } else if (record.lvl0) {
      algoliaRecord.type = 'lvl0'
    }
  }

  return algoliaRecord
}
