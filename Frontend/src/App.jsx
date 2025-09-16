import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Components/login'
import Navbar from './Components/Login/Navbar'
import BackLogin from './Components/Login/BackLogin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   {/* <Login/> */}
   <BackLogin/>
    </>
  )
}

export default App
