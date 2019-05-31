import React from "react"
import styles from "./home.css"
import store from "../../store"

export default () => {
  const { count } = store.state
  return (
    <div className={styles.home}>
      <p>This text will be blueviolet.</p>
      <i>store.count is: {count}</i>
      <br />
      <button onClick={() => store.update(s => (s.count += 1))}>count</button>
    </div>
  )
}
