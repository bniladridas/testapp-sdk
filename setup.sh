#!/bin/bash

# TestApp Setup Script
# This script sets up the development environment for TestApp

set -e  # Exit on any error

echo "🚀 Setting up TestApp..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Set up environment
echo "⚙️  Setting up environment..."
if [ ! -f .env ]; then
    cp env.example .env
    # Replace DATABASE_URL with current user
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$USER@localhost:5432/testapp|" .env
    rm .env.bak
    echo "✅ Created .env with DATABASE_URL=postgresql://$USER@localhost:5432/testapp"
else
    echo "⚠️  .env already exists, skipping..."
fi

# 3. Set up PostgreSQL
echo "🐘 Setting up PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL..."
    brew install postgresql@14
fi

echo "Starting PostgreSQL service..."
brew services start postgresql@14 || echo "Service already started"

echo "Creating database..."
psql -c "CREATE DATABASE testapp;" 2>/dev/null || echo "Database already exists"

# 4. Run migrations
echo "🗄️  Running database migrations..."
npm run migrate

echo "🎉 Setup complete!"
echo ""
echo "To start the app, run: npm run dev"
echo "Then visit: http://localhost:5173"