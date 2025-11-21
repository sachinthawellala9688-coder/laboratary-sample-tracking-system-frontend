import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Userhome from './pages/Userhome.jsx'

import Admin from './pages/Admin.jsx'
import ProtectedRoute from './pages/protected.jsx'
import ProtectedAdmin from './pages/Protectedadmin.jsx'




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path='/'element={<Login/>}></Route>
        <Route path='/register'element={<Register/>}></Route>
        <Route path='/user/*'element={<ProtectedRoute><Userhome/></ProtectedRoute>}></Route>
        <Route path='/admin/*'element={<ProtectedAdmin><Admin/></ProtectedAdmin>}></Route>
        <Route path='/*'element={<h1>Page not found error 404</h1>}></Route>
         
      </Routes> 
    </BrowserRouter> 
       
    </>
  )
}

export default App
