import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <>
   <h2>Cink</h2>
   <nav>
    <Link to='/'>Home</Link>
    <Link to=''></Link>
    <Link to=''></Link>
    <Link to=''></Link>
    <Link to='/profile'>Profile</Link>
   </nav>
    </>
  )
}

export default Sidebar