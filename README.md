# scrape-blog-post-page

> Scraping my blog posts using Cypress to send to Algolia search index

## Scripts

To see all Cypress blog post URLs

```text
$ node ./get-modified-post-urls
# saved blog-post-urls.json with the list of urls and the modified date

$ as-a . node ./filter-scraped-posts
# reads the blog-post-urls.json, checks which posts were scraped
# and saved the remaining urls into the file need-scraping.json

$ as-a . node ./scrape-filtered-posts
# takes the list of posts in need-scraping.json
# launches Cypress and uploads the results to Algolia
```
