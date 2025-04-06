import React from 'react'
import styles from "./Rightbar.module.css"

export default function Rightbar({children}) {
  return (
    <>
      <div className={styles.rightbar}>
        {children}
      </div>
    </>
  )
}
