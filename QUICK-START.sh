#!/bin/bash
# Quick Start Script for Enterprise Credit Repair CRM
# RJ Business Solutions - Rick Jefferson

set -e

echo "🚀 Enterprise Credit Repair CRM - Quick Start"
echo "=============================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check PostgreSQL (optional warning)
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found in PATH. Make sure you have a PostgreSQL database available."
    echo "   You can use a cloud database (Supabase, Railway, etc.) or local PostgreSQL."
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/credit_crm"

# Authentication
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="development"
EOF
    echo "✅ .env file created"
    echo "⚠️  Please edit .env and update DATABASE_URL with your PostgreSQL connection string"
    echo ""
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run db:generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env file and set your DATABASE_URL"
echo "2. Run: npm run db:migrate (to create database tables)"
echo "3. Run: npm run dev (to start development server)"
echo ""
echo "📚 Documentation: See README.md for full setup instructions"
echo ""
