# 🚀 SkillForge AI - Full-Stack Project Generator

A beautiful, professional AI-powered application that generates unique full-stack project ideas and code snippets.

## ✨ Features

- 🤖 **AI Idea Generation** - Generate unique project ideas with Groq AI
- 💻 **Code Generation** - Get working code snippets for your projects
- 💾 **Save Ideas** - Store your favorite project ideas
- 🎨 **Beautiful UI** - Modern, responsive design with animations
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔐 **User Authentication** - Secure login system

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, CSS3, Framer Motion
- **Backend:** Node.js, Express.js
- **AI:** Groq API (Llama3-70B)
- **Authentication:** Firebase Auth
- **Styling:** Custom CSS with glass-morphism effects

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd projectai
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   
   **Backend (.env in server folder):**
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3001
   NODE_ENV=development
   ```
   
   **Frontend (.env in client folder):**
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. **Start the development servers**
   ```bash
   # Start backend server
   cd server
   npm start
   
   # Start frontend (in new terminal)
   cd client
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## 🌐 Deployment

### Option 1: Vercel (Recommended)

#### Deploy Backend to Vercel:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy backend**
   ```bash
   cd server
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - `GROQ_API_KEY` = your_groq_api_key

#### Deploy Frontend to Vercel:

1. **Update API URL**
   ```bash
   cd client
   # Update .env with your backend URL
   echo "VITE_API_URL=https://your-backend-url.vercel.app" > .env
   ```

2. **Deploy frontend**
   ```bash
   vercel
   ```

### Option 2: Render

#### Deploy Backend to Render:

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure:**
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Environment Variables:**
     - `GROQ_API_KEY` = your_groq_api_key

#### Deploy Frontend to Render:

1. **Create a new Static Site**
2. **Configure:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     - `VITE_API_URL` = your_backend_render_url

### Option 3: Railway

1. **Connect your GitHub repository to Railway**
2. **Railway will auto-detect and deploy both frontend and backend**
3. **Set environment variables in Railway dashboard**

## 🔧 Environment Variables

### Backend (.env)
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

## 📱 Usage

1. **Login** with your credentials
2. **Generate Ideas:** Type any prompt and get AI-generated project ideas
3. **Generate Code:** Get working code snippets for your projects
4. **Save Ideas:** Store your favorite project ideas for later

## 🎨 UI Features

- **Glass-morphism effects** with blur and transparency
- **Gradient backgrounds** and colorful borders
- **Smooth animations** and hover effects
- **Responsive design** for all devices
- **Professional typography** with proper contrast

## 🔐 Authentication

The app uses Firebase Authentication for secure user login. Configure your Firebase project and update the environment variables.

## 🤖 AI Integration

Powered by Groq's Llama3-70B model for generating:
- Unique project ideas
- Complete project breakdowns
- Technology recommendations
- Feature lists
- Working code snippets

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email: sharmakshtij154@gmail.com

---

**Made with ❤️ by SkillForge AI Team**
