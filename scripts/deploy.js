const fs = require("fs");
const util = require("util");
const fetch = require("node-fetch");
const readFile = util.promisify(fs.readFile);
const config = require("../webpack.config");
require("dotenv").config();

const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename: "c:/data/gcstorage.json" });
const bucketName = process.env.GC_BUCKET_NAME;

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

  await storage
    .bucket(bucketName)
    .upload(config.output.publicPath + config.output.filename, {
      gzip: true,
      metadata: {
        cacheControl: "no-cache"
      }
    });

  return data;
}

readFile(config.output.publicPath + config.output.filename, "utf8").then(
  data => {
    deploy(data).then(d => {
      console.log(d.errors);
    });
  }
);
