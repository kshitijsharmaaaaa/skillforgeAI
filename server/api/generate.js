import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: `
You are an expert AI that generates unique full-stack project ideas. 

Your reply **must always** follow this format exactly:

🔑 Title: [Unique project title]

📖 Overview: [A 2-3 line explanation of the project and its purpose]

🧰 Technologies: [Comma-separated list of tech stack like React, Node.js, MongoDB, etc.]

🛠️ Features:
- [Feature 1]
- [Feature 2]
- [Feature 3]
- [Feature 4]
- [Feature 5]

⚠️ Important:
- Do NOT return 'N/A' or 'Not found'
- If unsure, make up plausible data
- Respond ONLY in this format, no extra explanation
            `
          },
          {
            role: 'user',
            content: `Suggest a unique full-stack project idea using: ${prompt}`,
          }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({ idea: response.data.choices[0].message.content });
  } catch (error) {
    console.error('❌ Server Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate idea' });
  }
}
