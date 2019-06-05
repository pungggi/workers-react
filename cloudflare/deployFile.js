const fs = require("fs")
const path = require("path")

import fetch from "node-fetch"
import { endpoint, ns_FILES } from "./"

const deployFile = async filePath => {
  console.log(filePath)

  const key = path.basename(filePath)
  const result = await fetch(
    `${endpoint}/accounts/${
      process.env.CLOUDFLARE_ACCOUNT_ID
    }/storage/kv/namespaces/${ns_FILES}/values/${key}`,
    {
      method: "PUT",
      headers: {
        "X-Auth-Email": process.env.CLOUDFLARE_EMAIL,
        "X-Auth-Key": process.env.CLOUDFLARE_KEY
      },
      body: fs.readFileSync(filePath, "utf8")
    }
  )
  return await result.json()
}

export default deployFile
