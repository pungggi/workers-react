import React from "react"
import _ from "./styles.css"
import $ from "state"

export default () => {
  const onCount = () => $.update(s => (s.count += 1))
  const { count } = $.state
  return (
    <div className={_.box}>
      <p>This text will be blueviolett. or not?</p>
      <i>store ount is: {count}</i>
      <br />
      <button onClick={onCount}>count</button>
    </div>
  )
}
