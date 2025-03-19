import React from 'react'
import "./Rightbar.css"

export default function Rightbar({children}) {
  return (
    <>
      <div className="rightbar">
        <button className="logoutBtn">ログアウト</button>
        {children}
      </div>
    </>
  )
}
