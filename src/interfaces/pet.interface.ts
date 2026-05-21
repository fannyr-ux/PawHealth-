export interface Pet {
  id?: string
  name: string
  type: string
  breed: string
  color: string
  age: number
  weight: number
  vaccinationCardUrl?: string
  ownerId: string
  createdAt: number
}