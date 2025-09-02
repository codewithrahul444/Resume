#!/bin/bash

# GitHub Push Script for Resume Craft Pro Mobile App
echo "🚀 Pushing Resume Craft Pro Mobile App to GitHub..."

# Set GitHub credentials
export GIT_USERNAME="codewithrahul444"
export GIT_TOKEN="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"
export REPO_URL="https://${GIT_USERNAME}:${GIT_TOKEN}@github.com/codewithrahul444/Resume.git"

# Configure git
git config user.name "codewithrahul444"
git config user.email "rahul@example.com"

# Remove existing remote if exists
git remote remove origin 2>/dev/null || true

# Add remote with authentication
git remote add origin $REPO_URL

# Push to GitHub
git push -u origin main

echo "✅ Successfully pushed to GitHub!"
echo "🔗 Repository: https://github.com/codewithrahul444/Resume"
