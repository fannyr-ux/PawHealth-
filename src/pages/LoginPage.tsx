import { useState } from 'react'
import { loginUser } from '../services/auth.service'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      await loginUser(email, password)

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-slate-900 p-8 rounded-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white mb-6">
          PawHealth AI
        </h1>

        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-4 p-3 rounded-xl bg-slate-800 text-white"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 p-3 rounded-xl bg-slate-800 text-white"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl"
        >
          {loading
            ? 'Ingresando...'
            : 'Iniciar sesión'}
        </button>

        <p className="text-slate-400 mt-4 text-center">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="text-emerald-400"
          >
            Registrarse
          </Link>
        </p>
      </form>
    </div>
  )
}