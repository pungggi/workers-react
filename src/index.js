import ReactDOMServer from "react-dom/server";
import routes from "./routes";

async function handleRequest(event) {
  const url = new URL(event.request.url);
  let rendered = ReactDOMServer.renderToString(routes[url.pathname]);
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
          <noscript>
            You need to enable JavaScript to run this app.
          </noscript>
          <div id="root">
            ${rendered}
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
}

self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});
