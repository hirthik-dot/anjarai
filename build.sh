#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting combined build..."

# 1. Build the main Client
echo "📦 Building Client..."
npm install --prefix client
npm run build --prefix client

# 2. Build the Admin Dashboard
echo "📦 Building Admin..."
npm install --prefix admin
npm run build --prefix admin

# 3. Combine them
echo "🛠️ Nesting Admin inside Client..."
mkdir -p client/dist/admin
cp -r admin/dist/. client/dist/admin/

echo "✅ Build complete! Both apps are in client/dist"
