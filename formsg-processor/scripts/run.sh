#!/bin/bash

# FormSG Processor Run Script
# This script helps run the FormSG Processor application

# Exit on error
set -e

echo "🚀 Starting FormSG Processor..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️ No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "⚠️ Please edit the .env file with your configuration before continuing."
    exit 1
fi

# Check if database is set up
echo "🔍 Checking database setup..."
npx prisma migrate status > /dev/null 2>&1 || {
    echo "⚠️ Database not set up. Running migrations..."
    npx prisma migrate deploy
    
    echo "🌱 Seeding database with initial data..."
    npx prisma db seed
}

# Start the application
echo "🚀 Starting application..."
npm start