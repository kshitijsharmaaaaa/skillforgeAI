#!/bin/bash

echo "🚀 SkillForge AI Deployment Script"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🌐 Choose deployment option:"
echo "1. Vercel (Recommended)"
echo "2. Render"
echo "3. Railway"
echo "4. Manual deployment instructions"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel..."
        echo ""
        
        # Deploy backend first
        echo "📡 Deploying backend..."
        cd server
        vercel --yes
        
        echo ""
        echo "✅ Backend deployed! Copy the URL above."
        echo ""
        read -p "Enter your backend URL (e.g., https://your-app.vercel.app): " backend_url
        
        # Update frontend environment
        cd ../client
        echo "VITE_API_URL=$backend_url" > .env
        
        echo ""
        echo "🌐 Deploying frontend..."
        vercel --yes
        
        echo ""
        echo "🎉 Deployment complete!"
        echo "Frontend URL: Check the URL above"
        echo "Backend URL: $backend_url"
        ;;
        
    2)
        echo ""
        echo "🌐 Deploying to Render..."
        echo ""
        echo "📋 Manual steps for Render:"
        echo "1. Go to https://render.com"
        echo "2. Connect your GitHub repository"
        echo "3. Create a new Web Service for backend"
        echo "4. Create a new Static Site for frontend"
        echo "5. Set environment variables:"
        echo "   - GROQ_API_KEY=your_api_key"
        echo "   - VITE_API_URL=your_backend_url"
        ;;
        
    3)
        echo ""
        echo "🚂 Deploying to Railway..."
        echo ""
        echo "📋 Manual steps for Railway:"
        echo "1. Go to https://railway.app"
        echo "2. Connect your GitHub repository"
        echo "3. Railway will auto-detect your app"
        echo "4. Set environment variables in dashboard"
        ;;
        
    4)
        echo ""
        echo "📖 Manual Deployment Instructions:"
        echo "=================================="
        echo ""
        echo "🌐 Vercel (Recommended):"
        echo "1. Install Vercel CLI: npm i -g vercel"
        echo "2. Deploy backend: cd server && vercel"
        echo "3. Deploy frontend: cd client && vercel"
        echo ""
        echo "🌐 Render:"
        echo "1. Connect GitHub repo to Render"
        echo "2. Create Web Service for backend"
        echo "3. Create Static Site for frontend"
        echo ""
        echo "🚂 Railway:"
        echo "1. Connect GitHub repo to Railway"
        echo "2. Auto-deploy both frontend and backend"
        echo ""
        echo "🔧 Environment Variables:"
        echo "- GROQ_API_KEY=your_groq_api_key"
        echo "- VITE_API_URL=your_backend_url"
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo "📧 For support: sharmakshtij154@gmail.com"
