export interface Pet {
  id?: string
  photoUrl?: string | null
  name: string
  type: string
  breed: string
  color: string
  age: number
  weight: number
  vaccinationCardUrl?: string | null
  gender: string
  ownerId: string
  createdAt: number
}
