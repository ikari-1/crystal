import React from 'react'
import styles from "./FilledButton.module.css";

export default function FilledButton({ text, onClick, type, form }) {
  return (
    <>
      <button className={styles.btn} onClick={onClick} type={type} form={form} >
        {text}
      </button>
    </>
  )
}
