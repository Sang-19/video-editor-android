const fs = require('fs');
const path = require('path');

const packageRoot = path.join(
  process.cwd(),
  'node_modules',
  '@zlucksolutions',
  'react-native-video-editor'
);

if (!fs.existsSync(packageRoot)) {
  throw new Error('Video editor SDK was not installed before its audio import patch ran.');
}

const extensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
let patchedFiles = 0;
let replacements = 0;

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!extensions.has(path.extname(entry.name))) continue;

    const original = fs.readFileSync(fullPath, 'utf8');
    const updated = original.replace(
      /(['"])react-native-audio-recorder-player\1/g,
      (match, quote) => {
        replacements += 1;
        return quote + 'react-native-nitro-sound' + quote;
      }
    );

    if (updated !== original) {
      fs.writeFileSync(fullPath, updated);
      patchedFiles += 1;
    }
  }
}

walk(packageRoot);
if (replacements === 0) {
  throw new Error('Expected audio-recorder import was not found in the video editor SDK. Review the SDK before building.');
}
console.log(`Patched ${replacements} audio import(s) in ${patchedFiles} SDK file(s) to use react-native-nitro-sound.`);
