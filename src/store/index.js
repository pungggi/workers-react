import createStore from "pure-store"
import modelData from "./model"

const STORAGE_KEY = "__store___"

let storedData
if (typeof document !== "undefined") {
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify($.state))
  })
  storedData = JSON.parse(localStorage.getItem(STORAGE_KEY))
}
const $ = createStore(storedData || modelData)

export default $
