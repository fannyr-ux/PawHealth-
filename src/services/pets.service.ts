import { addDoc, collection, getDocs, query, where, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Pet } from '../interfaces/pet.interface'

const petsCollection = collection(db, 'pets')
const aiRecommendationsCollection = collection(db, 'aiRecommendations')

// Crear mascota con foto y carnet en base64
export const createPet = async (pet: Pet) => {
  const docRef = await addDoc(petsCollection, {
    ...pet,
  })
  return docRef
}

// export const getPetsByOwner = async (id: string) => {
//   const docRef = doc(db, 'pets', id)
//   const snapshot = await getDoc(docRef)
//   if (snapshot.exists()) {
//     return { id: snapshot.id, ...snapshot.data() } as Pet
//   }
//   return null
// }

export const getPetsByOwner = async (
  uid: string
): Promise<Pet[]> => {

  const q = query(
    petsCollection,
    where('ownerId', '==', uid)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Pet[]
}

export const deletePet = async (id: string) => {
  const petRef = doc(db, 'pets', id)
  await deleteDoc(petRef)
}

export const getPetById = async (id: string): Promise<Pet | null> => {
  const petRef = doc(db, 'pets', id)
  const snapshot = await getDoc(petRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Pet
}

export const getRecommendationsByPetId = async (petId: string) => {
  const q = query(aiRecommendationsCollection, where('petId', '==', petId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getVaccinationTextByPetId = async (petId: string) => {
  const recordRef = doc(db, 'vaccinationRecords', petId)
  const recordSnap = await getDoc(recordRef)
  if (!recordSnap.exists()) return ''
  return recordSnap.data().extractedText || ''
}

export const saveAIRecommendation = async (petId: string, content: string) => {
  const recommendationRef = doc(db, 'aiRecommendations', `${petId}-routine`)
  await setDoc(recommendationRef, {
    petId,
    type: 'routine-diet-vaccines',
    content,
    createdAt: Date.now(),
  })
}
