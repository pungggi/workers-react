# Workers React Example

Combining the power of Cloudflare Workers and React will allow you to render the
same React code you would on the browser on Cloudflare Workers.

### Instructions

To see it live in the playground:

- `yarn preview`

To develop

- `yarn dev`

This examples shares Routes with @reach-router. To edit the routes head to:
`src/components/App/index.js`

### Webpack

- `webpack.config.js` is the bundle that is deployed to cloudflare.
- `webpack.dev.js` bundles for development purses only.

For keeping things manageable they both share the same folder `/bundles`

### About

[Cloudflare Workers](http://developers.cloudflare.com/workers/) allow you to write JavaScript which runs on all of Cloudflare's
150+ global data centers.
