const express = require("express");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Set URL for api server
 */

let appUrl = `http://localhost:${port}`; // local dev url

// default prod url:
if(process.env?.NODE_ENV === 'production'){
  appUrl = 'https://screenreadthis-api-server.mandrasch.eu';
  console.log(`Starting with production mode on ${appUrl}`);
}

// for ploi
// TODO: how can we setup an URL via process.env on ploi.io?

// for render.com
// https://render.com/docs/environment-variables
  // const appUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`;
if(process.env.RENDER_EXTERNAL_URL !== undefined){
  console.log(`Detected render.com env, URL: ${appUrl}`);
  appUrl = process.env.RENDER_EXTERNAL_URL;
}


/**
 * index page HTML
 */
const html = `
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <title>ScreenreadThis! API server endpoint</title>
    <style>
        body{
            font-family:Arial;
        }
    </style>
  </head>
  <body>
    <section>
      <h1>Hello from Accessibility Tree API endpoint demo!</h1>
      <p>README, Privacy, Imprint: <a href="https://github.com/mandrasch/screenreadthis-api-server">https://github.com/mandrasch/screenreadthis-api-server</a></p>

    </section>
  </body>
</html>
`


const puppeteer = require('puppeteer');
/**
 * GET /getA11yTree endpoint
 * (cors enabled, https://expressjs.com/en/resources/middleware/cors.html)
 */
app.get("/getA11yTree", cors(), async function (req, res) {

  // Validation: check if url was submitted
  if (!req.query.url) {
    res.status(500).send({ error: 'No URL submitted' });
    return;
  }

  // TODO: sanitize url necessary?
  const requestedUrl = req.query.url;
  console.log(`GET /getA11yTree ...`);

  // TODO: error catching?
  console.log('Fire up puppeteer ...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(requestedUrl, { waitUntil: 'domcontentloaded' });
  const accessibilityTreeSnapshot = await page.accessibility.snapshot();

  // get html lang
  await page.evaluate(() => {
    let htmlLang = document.querySelector('html').getAttribute("lang"); // returns null if not found
    if (htmlLang === null) {
      htmlLang = ''; // easier to parse
    }
  })

  // clear up
  await browser.close();

  // send a11y tree as json
  console.log('Successful! Sending json response...');
  let response = {... accessibilityTreeSnapshot};
  response.lang = htmlLang;
  res.json(response);
})

/**
 * GET / index page (static HTML)
 */
app.get("/", (req, res) => res.type('html').send(html));

/**
 * Start server
 */
app.listen(port, () => {
  console.log(`a11y-tree-api listening on port ${port}!`);
  console.log(`Index page: ${appUrl}`);
});
