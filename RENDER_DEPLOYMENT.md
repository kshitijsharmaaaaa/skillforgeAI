# 🚀 Deploy SkillForge AI to Render.com

## Step-by-Step Guide

### 1. Backend Deployment (Render)

1. **Go to:** https://render.com
2. **Sign up/Login** with GitHub
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository:** `kshitijsharmaaaaa/skillforgeAI`
5. **Configure the service:**
   - **Name:** `skillforge-ai-backend`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Plan:** Free

6. **Add Environment Variables:**
   - **Key:** `GROQ_API_KEY`
   - **Value:** `your_groq_api_key_here` (get from https://console.groq.com/)

7. **Click "Create Web Service"**

### 2. Frontend Deployment (Render)

1. **Click "New +" → "Static Site"**
2. **Connect your GitHub repository:** `kshitijsharmaaaaa/skillforgeAI`
3. **Configure:**
   - **Name:** `skillforge-ai-frontend`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

4. **Add Environment Variables:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-render-url.onrender.com`

5. **Click "Create Static Site"**

### 3. Update Frontend API URL

Once you have your backend URL, update the frontend environment variable with the new backend URL.

## ✅ Benefits of Render:

- **No Authentication Issues** - APIs work immediately
- **Free Tier** - Generous free plan
- **Auto-Deploy** - Deploys on every Git push
- **Custom Domains** - Add your own domain
- **SSL Certificates** - Automatic HTTPS

## 🔗 Your URLs will be:

- **Backend:** `https://skillforge-ai-backend.onrender.com`
- **Frontend:** `https://skillforge-ai-frontend.onrender.com`

## 🎉 Result:

Your AI will work perfectly without any authentication issues!
