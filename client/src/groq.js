import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function generateIdea(prompt) {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate`, { prompt });
    return response.data.idea;
  } catch (error) {
    console.error("❌ Client Error:", error);
    return "Something went wrong while generating your idea.";
  }
}
