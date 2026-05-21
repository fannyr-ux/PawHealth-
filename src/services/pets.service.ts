import { addDoc, collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Pet } from '../interfaces/pet.interface'

const petsCollection = collection(db, 'pets')

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
