import React from "react"
import _ from "./styles.css"
import $ from "state"

export default () => {
  const { count } = $.state
  return (
    <div className={_.box}>
      <p>This text will be blueviolet.</p>
      <i>store.count is: {count}</i>
      <br />
      <button onClick={() => $.update(s => (s.count += 1))}>count</button>
    </div>
  )
}
