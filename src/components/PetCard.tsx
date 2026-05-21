import { Pet } from '../interfaces/pet.interface'

interface Props {
  pet: Pet
}

export default function PetCard({
  pet,
}: Props) {
  return (
    <div className="bg-white/95 rounded-2xl p-6 border border-sky-200 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        {pet.name}
      </h2>

      <p className="text-slate-600">
        Tipo: {pet.type}
      </p>

      <p className="text-slate-600">
        Raza: {pet.breed}
      </p>

      <p className="text-slate-600">
        Edad: {pet.age} años
      </p>
    </div>
  )
}