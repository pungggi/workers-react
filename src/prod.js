import React from "react";
import ReactDOMServer from "react-dom/server";
import { ServerLocation } from "@reach/router";
import App from "./components/App";

const handleRequest = async event => {
  const url = new URL(event.request.url);
  const markup = ReactDOMServer.renderToString(
    <ServerLocation url={url.pathname}>
      <App />
    </ServerLocation>
  );
  return new Response(
    `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>ba</title>
        </head>
        <body>
          <div id="root">
            ${markup}
          </div>
        </body>
      </html>
  `,
    {
      headers: {
        "Content-Type": "text/html"
      }
    }
  );
};

self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});
