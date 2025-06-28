import React from 'react'
import styles from "./TextButton.module.css";

export default function TextButton({ text, onClick, type }) {
  return (
    <>
      <button className={styles.btn} onClick={onClick} type={type} >
        {text}
      </button>
    </>
  )
}
