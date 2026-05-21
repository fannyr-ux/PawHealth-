import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { Pet } from '../interfaces/pet.interface'

export default function PetDetailPage() {
  const { id } = useParams()
  const [pet, setPet] = useState<Pet | null>(null)

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return
      const docRef = doc(db, 'pets', id)
      const snapshot = await getDoc(docRef)
      if (snapshot.exists()) {
        setPet({ id: snapshot.id, ...snapshot.data() } as Pet)
      }
    }
    fetchPet()
  }, [id])

  if (!pet) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Loading pet details...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-xl mx-auto p-10 text-white">
        <h1 className="text-3xl font-bold mb-6">{pet.name}</h1>

        <p><strong>Type:</strong> {pet.type}</p>
        <p><strong>Breed:</strong> {pet.breed}</p>
        <p><strong>Age:</strong> {pet.age} years</p>
        <p><strong>Color:</strong> {pet.color}</p>
        <p><strong>Weight:</strong> {pet.weight} kg</p>

        {pet.vaccinationCardUrl ? (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Vaccination Card</h2>
            <a
              href={pet.vaccinationCardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline"
            >
              View Vaccination Card
            </a>
          </div>
        ) : (
          <p className="mt-6 italic text-gray-400">No vaccination card uploaded.</p>
        )}
      </div>
    </div>
  )
}
