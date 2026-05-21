import { Pet } from '../interfaces/pet.interface'

interface Props {
  pet: Pet
}

export default function PetCard({
  pet,
}: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-2">
        {pet.name}
      </h2>

      <p className="text-slate-400">
        Tipo: {pet.type}
      </p>

      <p className="text-slate-400">
        Raza: {pet.breed}
      </p>

      <p className="text-slate-400">
        Edad: {pet.age} años
      </p>
    </div>
  )
}