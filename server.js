const express = require("express");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Current url
 */
// https://render.com/docs/environment-variables
const appUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`;

/**
 * index page HTML
 */
const html = `
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <title>Hello from Accessibility Tree API endpoint!</title>
    <style>
        body{
            font-family:Arial;
        }
    </style>
  </head>
  <body>
    <section>
      <h1>Hello from Accessibility Tree API endpoint demo!</h1>

      <p><span style="font-style:italique;">Experimental.</span> This runs on a free tier on render.com, can be offline if limit is reached.</p>

      <h2>API usage</h2>

      <p>Use API via GET: <pre>${appUrl}/getA11yTree?url=ENCODED_URL</pre></p>

      <p>Example: <pre>${appUrl}/getA11yTree?url=https%3A%2F%2Fwww.w3.org%2FWAI%2Fdemos%2Fbad%2Fbefore%2Fhome.html</pre></p>

      <a href="${appUrl}/getA11yTree?url=https%3A%2F%2Fwww.w3.org%2FWAI%2Fdemos%2Fbad%2Fbefore%2Fhome.html">Open example response</a>

      <p><small>Example site used: <a href="https://www.w3.org/WAI/demos/bad/before/home.html" target="_blank">WAI inaccessible homepage example</a> from <a href="https://www.w3.org/WAI/demos/bad/">WAI Demos before and after</a></small></p>

      <h2>Get result for custom site</h2>
      <form method="GET" action="${appUrl}/getA11yTree">
        <label>URL: 
            <input name="url" value="https://">
        </label>
        <p>The submitted URL will be transferred and logged on render.com. </p>
        <button type="submit">GET</button>
      </form>


      <h2>About</h2>

      <p>README: <a href="https://github.com/mandrasch/a11y-tree-api">https://github.com/mandrasch/a11y-tree-api</a></p>
    </section>
  </body>
</html>
`


const puppeteer = require('puppeteer');
/**
 * GET /getA11yTree endpoint
 * (cors enabled, https://expressjs.com/en/resources/middleware/cors.html)
 */
app.get("/getA11yTree",cors(), async function (req, res) {

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
    // clear up
    await browser.close();

    // send a11y tree as json
    console.log('Successful! Sending json response...');
    res.json(accessibilityTreeSnapshot);
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
