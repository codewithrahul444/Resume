#!/bin/bash

# Build script for Telegram Bot App

echo "🚀 Building Telegram Bot App..."

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "❌ Expo CLI not found. Installing..."
    npm install -g @expo/cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for Android
echo "🤖 Building for Android..."
expo build:android --type apk

# Build for iOS (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Building for iOS..."
    expo build:ios
else
    echo "⚠️  iOS build skipped (macOS required)"
fi

echo "✅ Build complete!"
echo "📱 APK will be available in your Expo dashboard"
echo "🔗 Visit: https://expo.dev/accounts/[your-username]/projects/telegram-bot-app/builds"
