// server.js (Node/Express ejemplo)
import 'dotenv/config'
import express from 'express'
import axios from 'axios'

const app = express()
app.use(express.json())

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const requestOpenAICompletion = async (payload, headers) => {
  try {
    return await axios.post(
      'https://api.openai.com/v1/chat/completions',
      payload,
      { headers }
    )
  } catch (error) {
    const status = error?.response?.status
    if (status === 429) {
      const retryAfter = Number(error.response.headers?.['retry-after'] ?? 1) * 10000
      console.warn(`OpenAI rate limit hit, retrying after ${retryAfter}ms`)
      await sleep(retryAfter)
      return await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers })
    }
    throw error
  }
}

app.post('/api/ask-vet', async (req, res) => {
  try {
    const openAiKey = process.env.OPENAI_API_KEY
    if (!openAiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY no está configurada en el servidor.' })
    }

    const response = await requestOpenAICompletion(
      {
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'Eres un asistente veterinario especializado en mascotas.' },
          { role: 'user', content: req.body.question },
        ],
      },
      {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      }
    )

    res.json(response.data.choices[0].message.content)
  } catch (err) {
    const status = err?.response?.status ?? 500
    console.error('OpenAI request failed:', err)
    if (status === 429) {
      return res.status(429).json({
        error: 'Límite de tasa de OpenAI excedido. Intenta de nuevo en unos segundos.',
        details: err.response?.data,
      })
    }

    res.status(status).json({
      error: err?.message ?? 'Error desconocido en el servidor.',
      details: err.response?.data,
    })
  }
})

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'))
