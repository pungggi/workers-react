const fs = require("fs");
const util = require("util");
const fetch = require("node-fetch");
const readFile = util.promisify(fs.readFile);
const config = require("../webpack.config");
require("dotenv").config();

async function deploy(script) {
  const endpoint = `https://api.cloudflare.com/client/v4`;
  console.log(process.env.CLOUDFLARE_ZONE);

  let resp = await fetch(
    `${endpoint}/zones/${process.env.CLOUDFLARE_ZONE}/workers/script`,
    {
      method: "PUT",
      headers: {
        "cache-control": "no-cache",
        "content-type": "application/javascript",
        "X-Auth-Email": process.env.CLOUDFLARE_EMAIL,
        "X-Auth-Key": process.env.CLOUDFLARE_KEY
      },
      body: script
    }
  );

  let data = await resp.json();
  return data;
}

readFile(config.output.publicPath + "/" + config.output.filename, "utf8").then(
  data => {
    deploy(data).then(d => {
      console.log(d.errors);
    });
  }
);
