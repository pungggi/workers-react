const fs = require("fs");
const util = require("util");
const fetch = require("node-fetch");
const readFile = util.promisify(fs.readFile);
const opn = require("opn");
const config = require("../webpack.config");

async function newWorker(script) {
  const resp = await fetch("https://cloudflareworkers.com/script", {
    method: "POST",
    headers: {
      "cache-control": "no-cache",
      "content-type": "text/javascript"
    },
    body: script
  });

  const data = await resp.json();

  return data.id;
}

readFile(config.output.publicPath + config.output.filename, "utf8").then(
  data => {
    newWorker(data).then(id =>
      opn("https://cloudflareworkers.com/#" + id + ":https://reactjs.org", {
        app: "msedge"
      })
    );
  }
);
