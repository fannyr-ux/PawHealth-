import axios from "axios";

const API_URL = "https://api.openai.com/v1/chat/completions";

export const askVetAI = async (question) => {
  const response = await axios.post(
    API_URL,
    {
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente veterinario especializado en mascotas.",
        },
        {
          role: "user",
          content: question,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
};