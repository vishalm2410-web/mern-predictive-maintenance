#!/bin/bash

# MongoDB Atlas Setup Helper
# This script helps you set up MongoDB Atlas for deployment

echo "🗄️  MongoDB Atlas Setup Helper"
echo "================================"
echo ""
echo "1. Go to https://mongodb.com/atlas"
echo "2. Create a free account and cluster"
echo "3. Get your connection string"
echo ""
echo "Your connection string should look like:"
echo "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mern-app?retryWrites=true&w=majority"
echo ""
read -p "Paste your MongoDB Atlas connection string: " MONGO_URI

if [ -z "$MONGO_URI" ]; then
    echo "❌ No connection string provided. Exiting."
    exit 1
fi

# Update .env file
echo "📝 Updating .env file..."
sed -i "s|MONGO_URI=.*|MONGO_URI=$MONGO_URI|" .env

echo "✅ .env file updated!"
echo ""
echo "🚀 Ready for deployment!"
echo "Run 'git add . && git commit -m \"Update MongoDB URI\" && git push' to deploy"