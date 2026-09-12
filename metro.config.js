const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
config.cacheStores = ({ FileStore }) => [new FileStore({ root: '.metro-cache' })];
config.cacheVersion = '1';
module.exports = withNativeWind(config, { input: './global.css' });
