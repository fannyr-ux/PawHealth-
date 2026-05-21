import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'

import { db } from '../firebase/config'
import { Pet } from '../interfaces/pet.interface'

const petsCollection = collection(db, 'pets')

export const createPet = async (
  pet: Pet
) => {
  return await addDoc(petsCollection, pet)
}

export const getPetsByOwner = async (
  uid: string
) => {
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


