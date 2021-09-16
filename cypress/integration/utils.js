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
