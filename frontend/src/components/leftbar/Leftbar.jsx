import React from 'react'
import "./Leftbar.css"

export default function Leftbar({children}) {
  return (
    <>
      <div className="leftbar">
        {children}
      </div>
    </>
  )
}
