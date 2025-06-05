import React, { useContext, useState } from 'react'
import styles from "./Searchbar.module.css";
import SearchIcon from '@mui/icons-material/Search';
import { SearchContext } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";

export default function Searchbar() {

  const [ input, setInput ] = useState("");
  const { updateQuery } = useContext(SearchContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    updateQuery(input);
    navigate("/postList");
  }

  return (
    <>
      <form onSubmit={handleSearch} className={styles.container}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder='タイトルで投稿を検索' className={styles.input} />
        <button type='submit' className={styles.icon}><SearchIcon /></button>
      </form>
    </>
  )
}
