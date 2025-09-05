#!/bin/bash

TOKEN="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"
REPO="codewithrahul444/Resume"

upload_file() {
    local file_path="$1"
    local github_path="$2"
    local message="Add $github_path"
    
    if [ -f "$file_path" ]; then
        echo "Uploading $github_path..."
        curl -s -X PUT \
            -H "Authorization: token $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"message\":\"$message\",\"content\":\"$(base64 -w 0 "$file_path")\"}" \
            "https://api.github.com/repos/$REPO/contents/$github_path" > /dev/null
        echo "✅ $github_path uploaded"
    fi
}

# Upload key configuration files
upload_file "babel.config.js" "babel.config.js"
upload_file "metro.config.js" "metro.config.js"
upload_file "eas.json" "eas.json"
upload_file ".gitignore" ".gitignore"

# Upload source files
upload_file "src/config/config.js" "src/config/config.js"
upload_file "src/theme/theme.js" "src/theme/theme.js"

# Upload context files
upload_file "src/context/ThemeContext.js" "src/context/ThemeContext.js"
upload_file "src/context/AuthContext.js" "src/context/AuthContext.js"
upload_file "src/context/I18nContext.js" "src/context/I18nContext.js"

# Upload service files
upload_file "src/services/api.js" "src/services/api.js"
upload_file "src/services/auth.js" "src/services/auth.js"
upload_file "src/services/database.js" "src/services/database.js"
upload_file "src/services/i18n.js" "src/services/i18n.js"

# Upload screen files
upload_file "src/screens/SplashScreen.js" "src/screens/SplashScreen.js"
upload_file "src/screens/LoginScreen.js" "src/screens/LoginScreen.js"
upload_file "src/screens/ChatScreen.js" "src/screens/ChatScreen.js"
upload_file "src/screens/SavedResumesScreen.js" "src/screens/SavedResumesScreen.js"
upload_file "src/screens/SettingsScreen.js" "src/screens/SettingsScreen.js"

echo "🚀 All files uploaded to GitHub!"
echo "🔗 https://github.com/$REPO"
