# scrape-blog-post-page

> Scraping my blog posts using Cypress to send to Algolia search index

## Scripts

To see all Cypress blog post URLs

```
$ npm run demo:list-posts
# saved blog-post-urls.json with the list of urls
$ as-a . node ./filter-scraped-posts
# reads the blog-post-urls.json, checks which posts were scraped
# and saved the remaining urls into the file need-scraping.json
```
