import "preact/debug"
import React from "react"
import { render } from "react-dom"
import App from "./components/App"
import $ from "./store"

let root
const renderApp = () => {
  root = render(<App />, document.body, root)
}

if (module.hot) {
  module.hot.accept("./components/App", () => requestAnimationFrame(renderApp))
}

$.subscribe(renderApp)
renderApp()
