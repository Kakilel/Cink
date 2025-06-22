import React from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Spotify from './Components/platforms/Spotify';

import Dashboard from './Components/Dashboard'


function App() {
  
  return (
    <>

    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/privacy' element={<PrivacyPolicy/>}/>
      <Route path='/platform/spotify' element={<Spotify/>}/>
    </Routes>
  
   </>
  )
}

export default App
