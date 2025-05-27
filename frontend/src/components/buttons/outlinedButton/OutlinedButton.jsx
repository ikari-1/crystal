import React from 'react'
import styles from "./OutlinedButton.module.css";

export default function OutlinedButton({ text, onClick }) {
  return (
    <>
      <button className={styles.btn} onClick={onClick} >
        {text}
      </button>
    </>
  )
}
