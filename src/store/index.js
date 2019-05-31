import createStore from "pure-store"
import defaultData from "./default"

const STORAGE_KEY = "__store___"

let storedData
if (typeof document !== "undefined") {
  storedData = JSON.parse(localStorage.getItem(STORAGE_KEY))
}
const $ = createStore(storedData || defaultData)

if (typeof document !== "undefined") {
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify($.state))
  })
}

export default $
