import styles from "./TonalButton.module.css";

export default function TonalButton({ text, onClick, type, form }) {
  return (
    <>
      <button className={styles.btn} onClick={onClick} type={type} form={form} >
        {text}
      </button>
    </>
  )
}
