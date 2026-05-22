import axios from 'axios'

export const askVetAI = async (question: string) => {
  try {
    const response = await axios.post('/api/ask-vet', { question })
    return response.data.answer
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const errorMessage = error.response?.data?.error

      if (status === 429) {
        throw new Error(
          'OpenAI está limitando las solicitudes. Por favor, intenta de nuevo en 30-60 segundos.'
        )
      }

      if (status === 500) {
        throw new Error(errorMessage || 'Error en el servidor. Asegúrate de que el servidor backend está ejecutándose.')
      }

      throw new Error(errorMessage || error.message)
    }
    throw error
  }
}