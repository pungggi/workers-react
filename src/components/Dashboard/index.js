import React from "react"
import { useState } from "preact/hooks"
import s from "./styles.css"

export default () => {
  const [count, setCount] = useState(0)

  return (
    <div className={s.box}>
      <p>test</p>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  )
}
