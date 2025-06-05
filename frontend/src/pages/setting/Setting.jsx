import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react'
import Header from "../../components/header/Header";
import Navigation from '../../components/navigation/Navigation';
import styles from "./Setting.module.css";

export default function Setting() {

  const { theme, setTheme } = useContext(ThemeContext);

  const handleChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <>
      <Header />
      <Navigation />
      <main className={styles.main}>
        <select value={theme} onChange={handleChange} className={styles.select} >
          <option value="Diamond">ダイヤモンド（デフォルト）</option>
          <option value="Emerald">エメラルド</option>
          <option value="Ruby">ルビー</option>
          <option value="Sapphire">サファイア</option>
          <option value="Amethyst">アメジスト</option>
          <option value="Citrine">シトリン</option>
          <option value="Morganite">モルガナイト</option>
          <option value="Peridot">ペリドット</option>
          <option value="Turquoise">ターコイズ</option>
        </select>
      </main>
    </>
  )
}
