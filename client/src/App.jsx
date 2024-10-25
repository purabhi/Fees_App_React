import React from 'react'
import { Toaster } from "react-hot-toast";

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Enlist from './pages/Enlist'
import Fees from './pages/Fees'



import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'


import './App.css'



const App = () => {

  return (
    <>
    
    <Router>
        <Routes>
        <Route path={'/'} element={<Login/>} />
        <Route path={'/dashboard'} element={<Dashboard/>} />
        <Route path={'/enlist'} element={<Enlist/>} />
        <Route path={'/fees'} element={<Fees/>} />



       
        </Routes>
        <Toaster position="top-center"/>
    </Router>
    
    </>
   
    
  )
}

export default App