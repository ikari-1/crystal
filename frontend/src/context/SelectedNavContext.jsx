import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";

const SelectedNavContext = createContext();

export default function SelectedNavProvider({ children }) {
  const location = useLocation();
  const [ selectedNav, setSelectedNav ] = useState(location.pathname);

  useEffect(() => {
    setSelectedNav(location.pathname);
  },[location]);

  return (
    <SelectedNavContext.Provider value={{ selectedNav }} >
      { children }
    </SelectedNavContext.Provider>
  )
}

export function useSelectedNav() {
  return useContext(SelectedNavContext);
}