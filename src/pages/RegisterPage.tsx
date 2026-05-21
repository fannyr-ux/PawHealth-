import { useState } from 'react'
import { registerUser } from '../services/auth.service'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] =
    useState('')
  const [loading, setLoading] =
    useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      await registerUser(email, password)

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleRegister}
        className="bg-white/95 backdrop-blur-sm border border-sky-200 p-8 rounded-3xl w-full max-w-md shadow-xl"
      >
        <h1 className="text-3xl font-bold text-sky-900 mb-6">
          Crear Cuenta
        </h1>

        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-4 p-3 rounded-xl bg-sky-50 text-slate-900 border border-sky-200 focus:ring-2 focus:ring-sky-300"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 p-3 rounded-xl bg-sky-50 text-slate-900 border border-sky-200 focus:ring-2 focus:ring-sky-300"
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
          className="w-full bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-xl"
        >
          {loading
            ? 'Creando cuenta...'
            : 'Registrarse'}
        </button>

        <p className="text-slate-600 mt-4 text-center">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-sky-600 hover:text-sky-700"
          >
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  )
}