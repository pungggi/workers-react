const fs = require("fs")
const util = require("util")
const fetch = require("node-fetch")
const readFile = util.promisify(fs.readFile)
const config = require("../webpack.config")
require("dotenv").config()

const { Storage } = require("@google-cloud/storage")
const storage = new Storage({ keyFilename: "c:/data/gcstorage.json" })
const bucketName = process.env.GC_BUCKET_NAME

async function deploy(script) {
  const endpoint = `https://api.cloudflare.com/client/v4`
  console.log(process.env.CLOUDFLARE_ZONE)

  const resp = await fetch(`${endpoint}/zones/${process.env.CLOUDFLARE_ZONE}/workers/script`, {
    method: "PUT",
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/javascript",
      "X-Auth-Email": process.env.CLOUDFLARE_EMAIL,
      "X-Auth-Key": process.env.CLOUDFLARE_KEY
    },
    body: script
  })
  const data = await resp.json()

  const uploadOutput = storage.bucket(bucketName).upload(config.output.publicPath + config.output.filename, {
    gzip: true,
    metadata: {
      cacheControl: "no-cache"
    }
  })

  const uploadCss = storage.bucket(bucketName).upload(config.output.publicPath + "styles.css", {
    gzip: true,
    metadata: {
      cacheControl: "no-cache"
    }
  })

  const result = await Promise.all([
    uploadOutput.catch(error => {
      return error
    }),
    uploadCss.catch(error => {
      return error
    })
  ])

  console.log(result)

  return data
}

readFile(config.output.publicPath + config.output.filename, "utf8").then(data => {
  deploy(data).then(d => {
    console.log(d.errors)
  })
})
