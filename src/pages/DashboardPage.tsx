import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { FaDog, FaPaw } from 'react-icons/fa'
import { auth } from '../firebase/config'
import { getPetsByOwner } from '../services/pets.service'

export default function DashboardPage() {
  const [pets, setPets] = useState<any[]>([])

  useEffect(() => {
    const fetchPets = async () => {
      if (!auth.currentUser) return
      const data = await getPetsByOwner(auth.currentUser.uid)
      setPets(data)
    }
    fetchPets()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">My Pets</h1>
          <Link
            to="/pets/create"
            className="bg-emerald-500 hover:bg-emerald-600 px-5 py-3 rounded-xl text-white"
          >
            + Add Pet
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-slate-900 rounded-xl p-6 shadow-lg flex flex-col items-center text-white"
            >
              <FaDog className="text-4xl text-emerald-400 mb-3" />
              <h2 className="text-lg font-semibold mb-2">{pet.name}</h2>
              <Link
                to={`/pets/${pet.id}`}
                className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-full flex items-center"
              >
                <FaPaw className="text-white text-xl" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
