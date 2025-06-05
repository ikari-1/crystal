import { createContext, useState } from "react";
import axios from "axios";

export const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [ query, setQuery ] = useState("");
  const [ result, setResult ] = useState([]);

  const updateQuery = async (newQuery) => {
    setQuery(newQuery);
    try {
      const res = await axios.get("api/posts/search", {
        params: { title: newQuery }
      });
      console.log("テスト", res.data);
      setResult(res.data);
    } catch (err) {
      console.error("検索エラー", err);
      setResult([]);
    }
  };

  return (
    <SearchContext.Provider value={{ query, updateQuery, result }}>
      {children}
    </SearchContext.Provider>
  );
}