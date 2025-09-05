const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web-specific resolver
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Handle vector icons for web
config.resolver.alias = {
  '@react-native-vector-icons/get-image': 'react-native-vector-icons/lib/get-image',
};

module.exports = config;
