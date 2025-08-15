import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'https://skillforge-ai-frontend.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ SkillForge AI Server is Running");
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

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

    res.json({ idea: response.data.choices[0].message.content });
  } catch (error) {
    console.error('❌ Server Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate idea' });
  }
});

app.post('/generate-code', async (req, res) => {
  const { projectType, feature } = req.body;

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

    res.json({ code: response.data.choices[0].message.content });
  } catch (error) {
    console.error('❌ Code Generation Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
