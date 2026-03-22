#!/bin/bash

# MERN App Deployment Script for Render
# Run this script to prepare your app for deployment

echo "🚀 Preparing MERN app for deployment..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create one with your MongoDB URI."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if build is successful
echo "🔨 Running build check..."
npm run build

echo "✅ App is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Go to render.com and create a new Web Service"
echo "3. Connect your GitHub repo"
echo "4. Set environment variables:"
echo "   - MONGO_URI: your MongoDB Atlas connection string"
echo "   - NODE_ENV: production"
echo "5. Deploy!"
echo ""
echo "🌐 Your app will be available at: https://your-app-name.onrender.com"