import createStore from "pure-store"
import defaultData from "./default"

const STORAGE_KEY = "__store___"

const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY))

const $ = createStore(storedData || defaultData)

window.addEventListener("beforeunload", () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify($.state))
})

export default $
