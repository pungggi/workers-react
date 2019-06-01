const fs = require("fs")
const klaw = require("klaw")
const fetch = require("node-fetch")
const path = require("path")
const util = require("util")
const readFile = util.promisify(fs.readFile)
const config = require("../webpack.config")
const { Storage } = require("@google-cloud/storage")
require("dotenv").config()

const storage = new Storage({ keyFilename: "c:/data/gcstorage.json" })
const bucketName = process.env.GC_BUCKET_NAME

async function deployWorker() {
  const workerPath = config.output.publicPath + config.output.filename

  const script = fs.readFileSync(workerPath, "utf8")
  const endpoint = `https://api.cloudflare.com/client/v4`
  const resp = await fetch(
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
  )
  const result = await resp.json()
  return result
}

deployWorker().then(response => {
  if (!response.success) {
    console.log(response.errors)
    return
  }
  klaw(config.output.publicPath).on("data", async item => {
    if (!path.extname(item.path)) {
      // todo create directory in cloudstorage
      return
    }
    // console.log(item.path)

    const result = await storage.bucket(bucketName).upload(item.path, {
      gzip: true,
      metadata: {
        cacheControl: "no-cache"
      }
    })
  })
})
