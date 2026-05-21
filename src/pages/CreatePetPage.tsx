import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { auth, db } from '../firebase/config'
import { createPet } from '../services/pets.service'
import { FaPaw } from 'react-icons/fa'
import { Pet } from '../interfaces/pet.interface'
import { doc, setDoc } from 'firebase/firestore'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = pdfjsWorker

export default function CreatePetPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [breed, setBreed] = useState('')
  const [age, setAge] = useState<number | ''>('')
  const [color, setColor] = useState('')
  const [weight, setWeight] = useState<number | ''>('')
  const [gender, setGender] = useState('')
  const [vaccinationCard, setVaccinationCard] = useState<File | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)

  // Convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Extraer texto del PDF
  const extractPdfText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await getDocument({ data: arrayBuffer }).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((item: any) => item.str).join(' ') + '\n'
    }
    return text
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth.currentUser) return

    let vaccinationCardUrl: string | undefined
    let photoUrl: string | undefined
    let vaccinationData: string | undefined

    if (vaccinationCard) {
      vaccinationCardUrl = await fileToBase64(vaccinationCard)
      vaccinationData = await extractPdfText(vaccinationCard)
    }

    if (photo) {
      photoUrl = await fileToBase64(photo)
    }

    const petData: Pet = {
      name,
      type,
      breed,
      age: Number(age),
      color,
      weight: Number(weight),
      gender,
      ownerId: auth.currentUser.uid,
      createdAt: Date.now(),
      vaccinationCardUrl,
      photoUrl,
    }

    // Guardar mascota en pets
    const petRef = await createPet(petData)

    // Guardar datos del carnet en vaccinationRecords
    if (vaccinationData) {
      await setDoc(doc(db, 'vaccinationRecords', petRef.id), {
        petId: petRef.id,
        ownerId: auth.currentUser.uid,
        extractedText: vaccinationData,
        createdAt: Date.now(),
      })
    }

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-sky-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white/95 border border-sky-200 shadow-xl rounded-3xl p-8">
          <h1 className="text-3xl font-bold text-sky-900 mb-6 flex items-center gap-3">
            <FaPaw className="text-sky-500" />
            Registrar mascota
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3 rounded-xl bg-sky-50 border border-sky-200" />
              <input type="text" placeholder="Tipo (Perro, Gato...)" value={type} onChange={(e) => setType(e.target.value)} required className="w-full p-3 rounded-xl bg-sky-50 border border-sky-200" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Raza" value={breed} onChange={(e) => setBreed(e.target.value)} className="w-full p-3 rounded-xl bg-sky-50 border border-sky-200" />
              <select value={gender} onChange={(e) => setGender(e.target.value)} required className="w-full p-3 rounded-xl bg-sky-50 border border-sky-200">
                <option value="">Género</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <input type="number" placeholder="Edad" min={0} value={age} onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')} required className="w-full p-3 rounded-xl bg-sky-50 border border-sky-200" />
              <input type="number" placeholder="Peso (kg)" min={0} value={weight} onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')} required className="w-full p-3 rounded-xl bg-sky-50 border border-sky-200" />
              <input type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full p-3 rounded-xl bg-sky-50 border border-sky-200" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-slate-700 mb-2 block">Carnet de vacunación (PDF)</span>
                <input type="file" accept="application/pdf" onChange={(e) => setVaccinationCard(e.target.files?.[0] || null)} className="w-full text-slate-900" />
              </label>

              <label className="block">
                <span className="text-slate-700 mb-2 block">Foto</span>
                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="w-full text-slate-900" />
              </label>
            </div>

            <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl transition">
              Guardar mascota
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
