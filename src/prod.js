import React from "react"
import * as preact from "preact"
import renderToString from "preact-render-to-string"
import { ServerLocation } from "@reach/router"
import App from "./components/App"
import $ from "./store"
import Loadable from "react-loadable"
// todo fetch instead of import stats from "../bundles/modules.json"

const handleRequest = async event => {
  let cache = await caches.open("ba")
  let response = await cache.match(event.request)

  if (!response) {
    response = await fetch(event.request)
    event.waitUntil(cache.put(event.request, response.clone()))

    if (!response.ok) {
      await Loadable.preloadAll()
      let modules = []
      const url = new URL(event.request.url)
      const markup = renderToString(
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
          <ServerLocation url={url.pathname}>
            <App />
          </ServerLocation>
        </Loadable.Capture>
      )
      // todo fetch
      const stats = await fetch()
      let bundles = getBundles(stats, modules)
      response = new Response(
        `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" type="text/css" href="styles.css">
                <title>ba</title>
              </head>
              <body>
                <div id="root">
                  ${markup}
                </div>
                ${bundles
                  .map(bundle => {
                    return `<script src="./${bundle.file}"></script>`
                  })
                  .join("\n")}
                <script src="./worker.js"></script>
              </body>
            </html>`,
        {
          headers: {
            "Content-Type": "text/html"
          }
        }
      )
    }
  }
  // Cache hit
  return response
}

const getBundles = (manifest, moduleIds) => {
  return moduleIds.reduce((bundles, moduleId) => {
    return bundles.concat(manifest[moduleId])
  }, [])
}

self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event))
})

// app
if (typeof document !== "undefined") {
  const renderApp = async () => {
    await Loadable.preloadReady()
    preact.hydrate(
      <ServerLocation url={location.pathname}>
        <App />
      </ServerLocation>,
      document.getElementById("root")
    )
  }
  $.subscribe(renderApp)
  renderApp()
}

// worker cache
if (typeof navigator !== "undefined") {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/worker.js").then(
        registration => {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          )
        },
        err => {
          console.log("ServiceWorker registration failed: ", err)
        }
      )
    })
  }
}
