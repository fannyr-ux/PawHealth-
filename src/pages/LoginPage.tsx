import { useState } from 'react'
import { loginUser } from '../services/auth.service'
import { useNavigate, Link } from 'react-router-dom'

const dogLoginImg = new URL('../assets/dog-login.png', import.meta.url).href

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await loginUser(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-sky-200 flex">
        
        {/* Left side form */}
        <div className="w-1/2 bg-white/95 backdrop-blur-sm border-r border-sky-200 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-sky-900 mb-6 text-center">
            PawHealth AI
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-xl bg-sky-50 text-slate-900 border border-sky-200 focus:ring-2 focus:ring-sky-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-xl bg-sky-50 text-slate-900 border border-sky-200 focus:ring-2 focus:ring-sky-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-xl shadow font-semibold transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-slate-600 mt-4 text-center">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="text-sky-600 hover:text-sky-700 font-medium"
              >
                Register
              </Link>
            </p>
          </form>
        </div>

        {/* Right side image */}
        <div className="w-1/2">
          <img
            src={dogLoginImg}
            alt="Dog login"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
