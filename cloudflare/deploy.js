import dotenv from "dotenv"
import klaw from "klaw"
import path from "path"
import config from "../webpack.config"
import deployFile from "./deployFile"
import deployWorker from "./deployWorker"

dotenv.config()

const response = await deployWorker(config.output.publicPath + config.output.filename)

if (!response || !response.success) {
  console.log(response.errors)
  process.exit(1)
}

klaw(config.output.publicPath).on("data", async item => {
  if (!path.extname(item.path)) {
    return
  }
  if (config.output.filename === path.basename(item.path)) {
    return
  }

  const response = await deployFile(config.output.publicPath + path.basename(item.path))
  if (!response || !response.success) {
    console.log(response.errors)
  }
})
