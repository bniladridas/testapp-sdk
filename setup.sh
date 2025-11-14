#!/bin/bash
set -e

echo "Setting up TestApp..."

npm install

if [ ! -f .env ]; then
    cp env.example .env
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$USER@localhost:5432/testapp|" .env
    rm .env.bak
fi

if ! command -v psql >/dev/null 2>&1; then
    brew install postgresql@14
fi

brew services start postgresql@14 || true
psql -c "CREATE DATABASE testapp;" 2>/dev/null || true

npm run migrate

echo "Setup complete."
echo "Run: npm run dev"
