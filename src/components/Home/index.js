import React from "react"
import s from "./styles.css"
import store from "../../store"

export default () => {
  const { count } = store.state
  return (
    <div className={s.box}>
      <p>This text will be blueviolet.</p>
      <i>store.count is: {count}</i>
      <br />
      <button onClick={() => store.update(s => (s.count += 1))}>count</button>
    </div>
  )
}
