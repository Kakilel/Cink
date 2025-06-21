import React from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import Dashboard from './Components/Dashboard'


function App() {
  
  return (
    <>
<Dashboard/>
<Router>
  <Routes>
    {/* other routes */}
    <Route path="/privacy" element={<PrivacyPolicy />} />
  </Routes>
</Router>
   
    </>
  )
}

export default App
