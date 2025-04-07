import { useState } from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import AppRoutes from './Routes'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <>
      <Router>
        <AppRoutes />
      </Router>
    </>
  )
}

export default App
