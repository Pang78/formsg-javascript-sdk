#!/bin/bash

# FormSG Processor Setup Script
# This script helps set up the FormSG Processor application

# Exit on error
set -e

echo "🚀 Setting up FormSG Processor..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. You have version $NODE_VERSION."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "🔧 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️ Please edit the .env file with your configuration."
fi

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Ask if user wants to run migrations
read -p "Do you want to run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️ Running database migrations..."
    npx prisma migrate deploy
fi

# Build the application
echo "🏗️ Building the application..."
npm run build

echo "✅ Setup complete!"
echo
echo "Next steps:"
echo "1. Make sure your database is properly configured in .env"
echo "2. Start the application with 'npm start'"
echo "3. Configure your FormSG webhooks to point to your application"
echo
echo "For more information, see the README.md file." 