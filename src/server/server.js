import 'dotenv/config'
import express from 'express'
import axios from 'axios'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

const requestOpenAICompletion = async (
  payload,
  headers
) => {
  try {
    console.log(
      '[OpenAI] Sending request...'
    )

    return await axios.post(
      'https://api.openai.com/v1/chat/completions',
      payload,
      {
        headers,
        timeout: 30000,
      }
    )
  } catch (error) {
    const status =
      error?.response?.status

    console.error(
      `[OpenAI] Request failed with status ${status}:`,
      error.message
    )

    throw error
  }
}

app.post('/api/ask-vet', async (req, res) => {
  try {
    const openAiKey =
      process.env.OPENAI_API_KEY

    if (!openAiKey) {
      console.error(
        '[API] OPENAI_API_KEY no está configurada'
      )

      return res.status(500).json({
        error:
          'OPENAI_API_KEY no está configurada.',
      })
    }

    const question =
      req.body.question

    if (!question) {
      return res.status(400).json({
        error:
          'La pregunta es requerida.',
      })
    }

    console.log(
      '[API] Received request for PawHealth AI recommendation'
    )

    const response =
      await requestOpenAICompletion(
        {
          model: 'gpt-4.1-mini',

          max_tokens: 300,

          messages: [
            {
              role: 'system',
              content:
                'Eres un asistente veterinario especializado en mascotas. Responde de forma clara y breve.',
            },
            {
              role: 'user',
              content: question,
            },
          ],
        },
        {
          Authorization: `Bearer ${openAiKey}`,
          'Content-Type':
            'application/json',
        }
      )

    console.log(
      '[API] Successfully received response from OpenAI'
    )

    res.json({
      answer:
        response.data.choices[0]
          .message.content,
    })
  } catch (err) {
    const status =
      err?.response?.status ?? 500

    console.error(
      `[API] Error (status ${status}):`,
      err.message
    )

    console.log(
      JSON.stringify(
        err.response?.data,
        null,
        2
      )
    )

    if (status === 429) {
      return res.status(429).json({
        error:
          'OpenAI está limitando solicitudes o no tienes créditos disponibles.',
      })
    }

    res.status(status).json({
      error:
        err?.message ??
        'Error desconocido en el servidor.',
      details:
        err.response?.data,
    })
  }
})

app.listen(3000, () => {
  console.log(
    'Servidor corriendo en puerto 3000'
  )
})