import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminAuth from "./pages/AdminAuth.jsx"
import Role from "./Components/Role.jsx"
import CompanyCreate from './pages/CompanyCreate.jsx'
import AdminDashboard from "./pages/AdminDashboard"
import ManagerAuth from './pages/ManagerAuth.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Role />} />
        <Route path="/admin" element={<AdminAuth/>} />
        <Route path="/create-company" element={<CompanyCreate />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manager" element={<ManagerAuth/>} />
      </Routes>
</BrowserRouter>
    </>
  )
}

export default App
