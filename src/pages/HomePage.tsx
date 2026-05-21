import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sky-100 text-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl rounded-[32px] border border-sky-200 bg-white/95 p-10 shadow-2xl">
        <h1 className="text-6xl font-bold text-sky-900">PawHealth AI</h1>
        <p className="text-slate-600 mt-4 text-xl">
          Inteligencia artificial para la salud de tus mascotas.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-8 py-4 text-white hover:bg-sky-600 shadow"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-xl border border-sky-300 bg-white px-8 py-4 text-sky-700 hover:bg-sky-50"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  )
}
