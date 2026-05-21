import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/auth.service'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center justify-between">
      <h4 className="text-2xl font-bold text-white">
        PawHealth AI
      </h4>

      <div className="flex items-center gap-6">
        <Link
          to="/dashboard"
          className="text-slate-300 hover:text-white"
        >
          Home
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}