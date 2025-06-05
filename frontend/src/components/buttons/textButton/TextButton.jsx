import React from 'react'
import styles from "./TextButton.module.css";

export default function TextButton({ text, onClick }) {
  return (
    <>
      <button className={styles.btn} onClick={onClick} >
        {text}
      </button>
    </>
  )
}
