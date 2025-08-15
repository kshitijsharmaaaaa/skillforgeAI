import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { projectType, feature } = req.body;

  if (!projectType || !feature) {
    return res.status(400).json({ error: 'Project type and feature are required' });
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
You are a highly skilled full-stack developer AI. When given a project type and one key feature, you generate the full working code snippet or boilerplate related to that feature for the project.

Always reply with ONLY code blocks without any explanation.

Make the code as real-world ready as possible.

Never say "I'm an AI..." or any intro text. Only return clean code in markdown format.
            `
          },
          {
            role: 'user',
            content: `Generate code for a ${projectType} project that includes this feature: ${feature}`,
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    res.status(200).json({ code: response.data.choices[0].message.content });
  } catch (error) {
    console.error('❌ Code Generation Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate code' });
  }
}
