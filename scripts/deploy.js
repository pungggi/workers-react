const fs = require("fs");
const path = require("path");
const klaw = require("klaw");
const fetch = require("node-fetch");
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

klaw(config.output.publicPath).on("data", item => {
  if (!path.extname(item.path)) {
    // todo create directory in cloudstorage
    return;
  }
  if (item.path.includes("prebundle")) return;

  const data = fs.readFileSync(item.path, "utf8");
  deploy(data).then(deployed => {
    console.log(deployed.errors);
  });
});
