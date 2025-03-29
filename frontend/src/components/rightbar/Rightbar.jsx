import React from 'react'
import "./Rightbar.css"

export default function Rightbar({children}) {
  return (
    <>
      <div className="rightbar">
        <button className="rightbarBtn">ログアウト</button>
        {children}
      </div>
    </>
  )
}
