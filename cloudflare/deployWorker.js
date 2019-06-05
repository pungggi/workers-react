import fs from "fs"
import fetch from "node-fetch"
import { endpoint } from "./"

const deployWorker = async workerPath => {
  console.log(workerPath)

  const result = await fetch(
    `${endpoint}/zones/${process.env.CLOUDFLARE_ZONE}/workers/script`,
    {
      method: "PUT",
      headers: {
        "cache-control": "no-cache",
        "content-type": "application/javascript",
        "X-Auth-Email": process.env.CLOUDFLARE_EMAIL,
        "X-Auth-Key": process.env.CLOUDFLARE_KEY
      },
      body: fs.readFileSync(workerPath, "utf8")
    }
  )
  return await result.json()
}

export default deployWorker
