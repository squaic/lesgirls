const fs = require('fs');
const path = require('path');
const source = path.join(__dirname, '..', 'assets', 'images', 'les-girls', 'app-icon.png');
const destinationDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(destinationDir, { recursive: true });
fs.copyFileSync(source, path.join(destinationDir, 'icon-512.png'));
