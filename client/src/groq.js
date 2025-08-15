import axios from 'axios';

export async function generateIdea(prompt) {
  try {
    const response = await axios.post('http://localhost:3001/generate', { prompt });
    return response.data.idea;
  } catch (error) {
    console.error("❌ Client Error:", error);
    return "Something went wrong while generating your idea.";
  }
}
