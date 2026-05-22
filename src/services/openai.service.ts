import axios from 'axios'

export const askVetAI = async (question: string) => {
  try {
    const response = await axios.post('/api/ask-vet', { question })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.message)
    }
    throw error
  }
}