import React from 'react'
import styles from "./Leftbar.module.css"

export default function Leftbar({children}) {
  return (
    <>
      <div className={styles.leftbar}>
        {children}
      </div>
    </>
  )
}
