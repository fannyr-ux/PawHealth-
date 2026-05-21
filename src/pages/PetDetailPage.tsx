import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { db } from '../firebase/config'
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { Pet } from '../interfaces/pet.interface'
import { FaPaw } from 'react-icons/fa'
import { askVetAI } from '../services/openai.service'

export default function PetDetailPage() {
  const { id } = useParams()
  const [pet, setPet] = useState<Pet | null>(null)
  const [showVaccinationCard, setShowVaccinationCard] =
    useState(false)
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

  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!pet?.id) return
      const q = query(collection(db, 'aiRecommendations'), where('petId', '==', pet.id))
      const snapshot = await getDocs(q)
      const recs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setRecommendations(recs)
    }
    fetchRecommendations()
  }, [pet?.id])

  if (!pet) {
    return (
      <div className="min-h-screen bg-sky-100 text-slate-900 flex items-center justify-center">
        <p>Loading pet details...</p>
      </div>
    )
  }


 // función que se dispara al hacer clic
const getAIRecommendation = async (petId: string) => {
  try {
    // Aquí puedes personalizar la pregunta con datos del carnet
    const question = `Con los datos del carnet de ${petId}, dame recomendaciones de rutina, dieta y vacunas pendientes.`
    const aiText = await askVetAI(question)

    // Guardar en Firestore
    await setDoc(doc(db, 'aiRecommendations', `${petId}-routine`), {
      petId,
      type: 'routine-diet-vaccines',
      content: aiText,
      createdAt: Date.now(),
    })

    alert(`Recomendación guardada:\n${aiText}`)
  } catch (err) {
    console.error('Error al pedir recomendación AI:', err)
    alert('Hubo un error al obtener la recomendación.')
  }
}

  return (
    <div className="min-h-screen bg-sky-100">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-sky-200">

          {/* Pet image */}
          {pet.photoUrl ? (
            <img
              src={pet.photoUrl} // base64 string
              alt={pet.name}
              className="w-full h-64 object-cover rounded-t-3xl"
            />
          ) : (
            <div className="w-full h-64 bg-sky-200 flex items-center justify-center">
              <FaPaw className="text-5xl text-sky-500" />
            </div>
          )}

          {/* Pet info */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-sky-700 mb-4">{pet.name}</h1>
            <div className="grid grid-cols-2 gap-4 text-slate-700">
              <p><strong>Type:</strong> {pet.type}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Age:</strong> {pet.age} years</p>
              <p><strong>Weight:</strong> {pet.weight} kg</p>
              <p><strong>Color:</strong> {pet.color}</p>
              <p><strong>Gender:</strong> {pet.gender || 'Not specified'}</p>
            </div>

            {/* Vaccination card */}
            {pet.vaccinationCardUrl ? (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">
                    Vaccination Card
                  </h2>

                  <button
                    onClick={() =>
                      setShowVaccinationCard(
                        !showVaccinationCard
                      )
                    }
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg"
                  >
                    {showVaccinationCard
                      ? 'Hide'
                      : 'View'}
                  </button>
                </div>

                {showVaccinationCard && (
                  <div className="border border-sky-200 rounded-xl overflow-hidden">
                    <embed
                      src={pet.vaccinationCardUrl}
                      type="application/pdf"
                      width="100%"
                      height="500px"
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-6 italic text-gray-400">
                No vaccination card uploaded.
              </p>
            )}

            {/* Recommendation section */}
        

<div className="mt-8">
  <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
  <div className="mt-8">
    <div className="grid grid-cols-1 gap-4">
      <button
        onClick={() => getAIRecommendation(pet.id!)}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
      >
        <FaPaw className="text-white text-lg" />
        PawHealth AI
      </button>
    </div>
  </div>

  {/* Lista de recomendaciones guardadas */}
  <div className="mt-6">
    {recommendations.length > 0 ? (
      <ul className="space-y-4">
        {recommendations.map((rec) => (
          <li key={rec.id} className="bg-sky-50 border border-sky-200 rounded-xl p-4">
            <p className="text-slate-700">
              <strong>{rec.type.toUpperCase()}:</strong> {rec.content}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(rec.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="italic text-gray-400">No hay recomendaciones aún.</p>
    )}
  </div>
</div>



            {/* Action button */}

          </div>
        </div>
      </div>
    </div>
  )
}
