// server.js (Node/Express ejemplo)
import 'dotenv/config'
import express from 'express'
import axios from 'axios'

const app = express()
app.use(express.json())

app.post('/api/ask-vet', async (req, res) => {
  try {
    const openAiKey = process.env.OPENAI_API_KEY
    if (!openAiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY no está configurada en el servidor.' })
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'Eres un asistente veterinario especializado en mascotas.' },
          { role: 'user', content: req.body.question },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )
    res.json(response.data.choices[0].message.content)
  } catch (err) {
    console.error('OpenAI request failed:', err)
    res.status(500).json({ error: err?.message ?? 'Error desconocido en el servidor.' })
  }
})

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'))
