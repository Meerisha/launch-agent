#!/bin/bash

echo "🚀 LaunchPilot Deployment Script"
echo "================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Add all files to git
echo "📝 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: LaunchPilot ready for production"

echo ""
echo "✅ Project is ready for deployment!"
echo ""
echo "🌐 Next steps:"
echo "1. Push to GitHub: git remote add origin <your-repo-url> && git push -u origin main"
echo "2. Deploy to Vercel: vercel"
echo "3. Or visit https://vercel.com to deploy via dashboard"
echo ""
echo "🔑 Don't forget to add your environment variables:"
echo "   - TAVILY_API_KEY"
echo "   - FIRECRAWL_API_KEY" 