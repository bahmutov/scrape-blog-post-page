# scrape-blog-post-page [![Scrape](https://github.com/bahmutov/scrape-blog-post-page/actions/workflows/scrape.yml/badge.svg?branch=main)](https://github.com/bahmutov/scrape-blog-post-page/actions/workflows/scrape.yml) ![cypress version](https://img.shields.io/badge/cypress-9.7.0-brightgreen) [![main](https://github.com/bahmutov/scrape-blog-post-page/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/bahmutov/scrape-blog-post-page/actions/workflows/main.yml)

> Scraping my blog posts using Cypress to send to Algolia search index

Read the blog post [Incremental Blog Scraping](https://glebbahmutov.com/blog/incremental-post-scraping/)

## Scripts

To see all Cypress blog post URLs

```text
$ node ./bin/get-modified-post-urls
# saved blog-post-urls.json with the list of urls and the modified date

$ as-a . node ./filter-scraped-posts
# reads the blog-post-urls.json, checks which posts were scraped
# and saved the remaining urls into the file need-scraping.json

$ as-a . node ./scrape-filtered-posts
# takes the list of posts in need-scraping.json
# launches Cypress and uploads the results to Algolia
```

Note: to check if the blog post needs scraping, I use [was-it-scraped](https://github.com/bahmutov/was-it-scraped) module. A blog post needs scraping if it has never been scraped, or was edited after the last scrape.

## Scraping on CI

The same steps for scraping are performed on CI, see the [.github/workflows/scrape.yml](./.github/workflows/scrape.yml) workflow. If scraping stops because there were no commits, push a new commit and enable the workflow. You can trigger the scraping manually by [running the action](https://github.com/bahmutov/scrape-blog-post-page/actions/workflows/scrape.yml).

## Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2022

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)
- [Cypress Advent 2021](https://cypresstips.substack.com/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/scrape-blog-post-page/issues) on Github

## MIT License

Copyright (c) 2022 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
