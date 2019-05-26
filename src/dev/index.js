import React from "react";
import { render } from "react-dom";
import "preact/debug";
import App from "../components/App";

let root;
function init() {
  root = render(<App />, document.body, root);
}

if (module.hot) {
  module.hot.accept("../components/App", () => requestAnimationFrame(init));
}

init();
