import React from 'react'
import styles from "./FAB.module.css"
import CreateIcon from '@mui/icons-material/Create';

export default function FAB() {
  return (
    <>
      <button className={styles.btn}>
        <CreateIcon className={styles.icon} />
      </button>
    </>
  )
} 
