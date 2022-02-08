# scrape-blog-post-page

> Scraping my blog posts using Cypress to send to Algolia search index

## Scripts

To see all Cypress blog post URLs

```text
$ npm run demo:list-posts
# saved blog-post-urls.json with the list of urls

$ as-a . node ./filter-scraped-posts
# reads the blog-post-urls.json, checks which posts were scraped
# and saved the remaining urls into the file need-scraping.json

$ as-a . node ./scrape-filtered-posts
# takes the list of posts in need-scraping.json
# launches Cypress and uploads the results to Algolia
```
