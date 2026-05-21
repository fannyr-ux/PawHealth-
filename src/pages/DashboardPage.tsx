import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { FaDog, FaPaw, FaTrash } from 'react-icons/fa'
import { auth } from '../firebase/config'
import { getPetsByOwner, deletePet } from '../services/pets.service'
import { Pet } from '../interfaces/pet.interface'

export default function DashboardPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPets = async () => {
      if (!auth.currentUser) return
      try {
        const data = await getPetsByOwner(auth.currentUser.uid)
        setPets(data)
      } catch (err) {
        console.error('Error fetching pets:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPets()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deletePet(id)
      setPets((prev) => prev.filter((p) => p.id !== id)) // actualizar estado
    } catch (err) {
      console.error('Error deleting pet:', err)
    }
  }

  return (
    <div className="min-h-screen bg-sky-100">
      <Navbar />

      <div className="p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Pets</h1>
          <Link
            to="/pets/create"
            className="bg-sky-500 hover:bg-sky-600 px-5 py-3 rounded-xl text-white"
          >
            + Add Pet
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-600">Loading your pets...</p>
        ) : pets.length === 0 ? (
          <div className="text-center text-slate-600 mt-10">
            <FaDog className="text-5xl text-sky-400 mx-auto mb-4" />
            <p className="text-lg font-medium">No pets yet</p>
            <p className="text-sm">Start by adding your first pet!</p>
            <Link
              to="/pets/create"
              className="mt-4 inline-block bg-sky-500 hover:bg-sky-600 px-5 py-2 rounded-xl text-white"
            >
              + Add Pet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white/95 rounded-xl p-6 shadow-lg flex flex-col items-center text-slate-900 border border-sky-200 hover:shadow-xl transition relative"
              >
                {/* Botón eliminar */}
                <button
                  onClick={() => handleDelete(pet.id!)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  title="Delete Pet"
                >
                  <FaTrash className="text-sm" />
                </button>

                <FaDog className="text-4xl text-sky-500 mb-3" />
                <h2 className="text-lg font-semibold mb-2">{pet.name}</h2>
                <p className="text-slate-600">{pet.breed || 'Unknown breed'}</p>
                <p className="text-slate-500 text-sm">
                  {pet.gender ? pet.gender : 'Gender not specified'}
                </p>
                <Link
                  to={`/pets/${pet.id}`}
                  className="mt-4 bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-full flex items-center text-white"
                >
                  <FaPaw className="text-white text-xl" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
