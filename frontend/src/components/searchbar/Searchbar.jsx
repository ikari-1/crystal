import React, { useContext, useState } from 'react'
import styles from "./Searchbar.module.css";
import SearchIcon from '@mui/icons-material/Search';
import { SearchContext } from "../../context/SearchContext";

export default function Searchbar() {

  const [ input, setInput ] = useState("");
  const { updateQuery } = useContext(SearchContext);

  const handleSearch = (e) => {
    e.preventDefault();
    updateQuery(input);
  }

  return (
    <>
      <form onSubmit={handleSearch} className={styles.container}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder='タイトルで検索' className={styles.input} />
        <button type='submit' className={styles.icon}><SearchIcon /></button>
      </form>
    </>
  )
}
