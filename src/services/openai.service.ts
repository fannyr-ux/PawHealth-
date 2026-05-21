import axios from "axios";

export const askVetAI = async (question: string) => {
  const response = await axios.post('/api/ask-vet', { question })
  return response.data
}