# ScreenreadThis! API server

Retrieve the accessibility tree for URLs via simple API call, made possible via [Accessibility.snapshot()](https://pptr.dev/api/puppeteer.accessibility.snapshot) by Puppeteer. Server implemented via express.

Created for [screenreadthis.mandrasch.eu](https://screenreadthis.mandrasch.eu/).

## API usage

- Call via `/?getA11yTree?url=<ENCODED_URL>`
- Example request: `/getA11yTree?url=https%3A%2F%2Fwww.a11yproject.com%2F` 

Demo: https://screenreadthis-api-server.onrender.com/getA11yTree?url=https%3A%2F%2Fwww.a11yproject.com%2F
(can take a minute or two)

! This demo runs on a limited resources cloud hosting, only use it for testing please. !

## Host your own (NodeJS)

You can host this API server yourself:

- https://render.com/docs/deploy-node-express-app (use `npm install` and `npm start` as commands)
- https://ploi.io/news/nodejs-support-is-here (Currently not working

```
# supervisor error output
 at processTicksAndRejections (node:internal/process/task_queues:83:21)
    at endReadableNT (node:internal/streams/readable:1345:12)
    at Socket.emit (node:events:539:35)
    at Socket.onend (node:readline:277:10)
    at Interface.close (node:readline:586:8)
    at Interface.emit (node:events:539:35)
    at Interface.<anonymous> (/home/ploi/screenreadthis-api-server.mandrasch.eu/node_modules/puppeteer/lib/cjs/puppeteer/node/BrowserRunner.js:278:24)
    at onClose (/home/ploi/screenreadthis-api-server.mandrasch.eu/node_modules/puppeteer/lib/cjs/puppeteer/node/BrowserRunner.js:290:20)
TROUBLESHOOTING: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md
/home/ploi/screenreadthis-api-server.mandrasch.eu/node_modules/puppeteer/.local-chromium/linux-1036745/chrome-linux/chrome: error while loading shared libraries: libatk-1.0.so.0: cannot open shared object file: No such file or directory
Error: Failed to launch the browser process!
```

- https://cleavr.io/nodejs/ (not tested yet)
- https://www.mittwald.de/hosting-addons/nodejs (not tested yet)

## Local development

```
npm install
npm run dev
```

## Run production server

```
# this will call NODE_ENV=production node server.js
npm start
```

## Imprint and Privacy

https://screenreadthis-api-server.onrender.com is hosted on european Cloud Instances via render.com, see https://render.com/privacy for more information. 

<!-- Not working currently:>
https://screenreadthis-api-server.mandrasch.eu is hosted on Hetzner European Cloud service, no personal data is stored. See https://docs.hetzner.com/general/general-terms-and-conditions/data-privacy-faq/ for more information on server log storage.
-->
Contact information / imprint: https://matthias-andrasch.eu/blog/impressum-datenschutz/

## License

Feel free to fork / re-use this for your own purpose! My own source code is provided as CC0/Public Domain, see package.json for licenses of used open source packages.