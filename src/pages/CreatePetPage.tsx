import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import { auth } from '../firebase/config'
import { createPet } from '../services/pets.service'
import { FaPaw } from 'react-icons/fa' // Icon import

export default function CreatePetPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [breed, setBreed] = useState('')
  const [age, setAge] = useState<number | ''>('')
  const [color, setColor] = useState('')
  const [weight, setWeight] = useState<number | ''>('')
  const [vaccinationCard, setVaccinationCard] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth.currentUser) return

    const petData = {
      name,
      type,
      breed,
      age: Number(age),
      color,
      weight: Number(weight),
      ownerId: auth.currentUser.uid,
      createdAt: Date.now(),
    }

    // Upload vaccination card to storage here if needed
    // petData.vaccinationCardUrl = uploadedFileUrl

    await createPet(petData)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-xl mx-auto p-10">
        <div className="bg-slate-900 p-8 rounded-2xl shadow-lg">
          <h1 className="flex items-center justify-center text-3xl font-bold text-white mb-6">
            <FaPaw className="mr-2 text-emerald-400" />
            Pet Registration
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Type (e.g. Dog, Cat)"
              className="w-full p-3 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-emerald-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Breed"
              className="w-full p-3 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-emerald-500"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />

            <input
              type="number"
              placeholder="Age (years)"
              className="w-full p-3 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-emerald-500"
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
              min={0}
            />

            <input
              type="text"
              placeholder="Color"
              className="w-full p-3 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-emerald-500"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />

            <input
              type="number"
              placeholder="Weight (kg)"
              className="w-full p-3 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-emerald-500"
              value={weight}
              onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
              min={0}
            />

            <div>
              <label className="block text-white mb-2">Vaccination Card</label>
              <input
                type="file"
                accept="image/*,.pdf"
                className="w-full p-3 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-emerald-500"
                onChange={(e) => setVaccinationCard(e.target.files?.[0] || null)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 p-3 rounded-xl text-white font-semibold transition"
            >
              Save Pet
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
