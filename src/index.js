import { renderToString } from "react-dom/server";
import routes from "./routes";

async function handleRequest(event) {
  const url = new URL(event.request.url);
  let markup = renderToString(routes[url.pathname]);
  return new Response(
    `
    <!DOCTYPE html>
      <html lang="de">
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
}

self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});
