import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/auth.service'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  return (
    <nav className="bg-sky-600 border-b border-sky-300 px-6 py-4 flex items-center justify-between text-white">
      {/* Logo */}
      <h4 className="text-2xl font-bold">PawHealth AI</h4>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/dashboard" className="text-sky-100 hover:text-white">
          Home
        </Link>
        <button
          onClick={handleLogout}
          className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-xl text-white"
        >
          Logout
        </button>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-sky-700 flex flex-col items-center gap-4 py-6 md:hidden shadow-lg">
          <Link
            to="/dashboard"
            className="text-sky-100 hover:text-white text-lg"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false)
              handleLogout()
            }}
            className="bg-sky-500 hover:bg-sky-600 px-6 py-2 rounded-xl text-white text-lg"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
