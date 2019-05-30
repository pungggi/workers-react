import React from "react";
import * as preact from "preact";
import renderToString from "preact-render-to-string";
import { ServerLocation } from "@reach/router";
import App from "./components/App";

const handleRequest = async event => {
  let cache = await caches.open("ba");
  let response = await cache.match(event.request);

  if (!response) {
    response = await fetch(event.request);
    event.waitUntil(cache.put(event.request, response.clone()));

    if (!response.ok) {
      const url = new URL(event.request.url);
      const markup = renderToString(
        <ServerLocation url={url.pathname}>
          <App />
        </ServerLocation>
      );
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
                <script src="./worker.js"></script>
              </body>
            </html>`,
        {
          headers: {
            "Content-Type": "text/html"
          }
        }
      );
    }
  }
  // Cache hit
  return response;
};

self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});

if (typeof document !== "undefined") {
  preact.hydrate(
    <ServerLocation url={location.pathname}>
      <App />
    </ServerLocation>,
    document.getElementById("root")
  );
}

if (typeof navigator !== "undefined") {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/worker.js").then(
        registration => {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        },
        err => {
          console.log("ServiceWorker registration failed: ", err);
        }
      );
    });
  }
}
